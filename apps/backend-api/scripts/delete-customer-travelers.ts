import { config } from 'dotenv';
import { eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { resolve } from 'node:path';
import { Pool } from 'pg';
import { customers } from '../src/modules/customers/infrastructure/persistence/customer.schema';
import {
  travelerDocuments,
  travelers,
} from '../src/modules/customers/submodules/customer-travelers/infrastructure/persistence/traveler.schema';

config({ path: resolve(__dirname, '../.env') });

interface Arguments {
  customerId?: string;
  phone?: string;
  confirm?: string;
}

function parseArguments(argv: string[]): Arguments {
  const values = new Map<string, string>();
  for (const argument of argv) {
    const match = /^--(customer-id|phone|confirm)=(.+)$/.exec(argument);
    if (!match) throw new Error(`Unknown argument: ${argument}`);
    if (values.has(match[1])) throw new Error(`Duplicate argument: --${match[1]}`);
    values.set(match[1], match[2].trim());
  }

  const customerId = values.get('customer-id');
  const phone = values.get('phone');
  if (Boolean(customerId) === Boolean(phone)) {
    throw new Error('Specify exactly one of --customer-id=<uuid> or --phone=<number>');
  }
  if (customerId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(customerId)) {
    throw new Error('--customer-id must be a UUID');
  }
  return { customerId, phone, confirm: values.get('confirm') };
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function deleteCustomerTravelers(): Promise<void> {
  const args = parseArguments(process.argv.slice(2));
  const pool = new Pool({
    host: requiredEnv('DATABASE_HOST'),
    port: Number(requiredEnv('DATABASE_PORT')),
    database: requiredEnv('DATABASE_NAME'),
    user: requiredEnv('DATABASE_USER'),
    password: requiredEnv('DATABASE_PASSWORD'),
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
    max: 1,
  });

  try {
    const database = drizzle(pool);
    const [customer] = await database
      .select({
        id: customers.id,
        phone: customers.phone,
        email: customers.email,
        firstName: customers.firstName,
        lastName: customers.lastName,
      })
      .from(customers)
      .where(
        args.customerId
          ? eq(customers.id, args.customerId)
          : eq(customers.phone, args.phone!),
      )
      .limit(1);
    if (!customer) throw new Error('Customer not found');

    const travelerRows = await database
      .select({ id: travelers.id })
      .from(travelers)
      .where(eq(travelers.customerId, customer.id));
    const travelerIds = travelerRows.map(({ id }) => id);
    const documentRows = travelerIds.length
      ? await database
          .select({ id: travelerDocuments.id })
          .from(travelerDocuments)
          .where(inArray(travelerDocuments.travelerId, travelerIds))
      : [];
    const displayName = [customer.firstName, customer.lastName]
      .filter(Boolean)
      .join(' ');

    console.info(`Customer: ${displayName} (${customer.id})`);
    console.info(`Phone: ${customer.phone ?? '—'}; email: ${customer.email ?? '—'}`);
    console.info(`Travelers to delete: ${travelerIds.length}`);
    console.info(`Traveler documents to delete: ${documentRows.length}`);
    if (!args.confirm) {
      console.info('Dry run only. Re-run with --confirm=<customer-id> to delete.');
      return;
    }
    if (args.confirm !== customer.id) {
      throw new Error('--confirm must exactly match the resolved customer UUID');
    }

    const result = await database.transaction(async (transaction) => {
      const documents = travelerIds.length
        ? await transaction
            .delete(travelerDocuments)
            .where(inArray(travelerDocuments.travelerId, travelerIds))
            .returning({ id: travelerDocuments.id })
        : [];
      const deletedTravelers = travelerIds.length
        ? await transaction
            .delete(travelers)
            .where(
              eq(travelers.customerId, customer.id),
            )
            .returning({ id: travelers.id })
        : [];
      return { documents: documents.length, travelers: deletedTravelers.length };
    });

    console.info(
      `Deleted ${result.travelers} travelers and ${result.documents} traveler documents. Customer account and bookings were kept.`,
    );
  } finally {
    await pool.end();
  }
}

deleteCustomerTravelers().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
