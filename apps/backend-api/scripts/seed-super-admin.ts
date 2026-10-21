import { hash } from 'argon2';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { resolve } from 'node:path';
import { Pool } from 'pg';
import { AdminPermission } from '../src/modules/admin/domain/admin.types';
import { admins } from '../src/modules/admin/infrastructure/persistence/admin.schema';

config({ path: resolve(__dirname, '../.env') });

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function seedSuperAdmin(): Promise<void> {
  const login = requiredEnv('ADMIN_SEED_LOGIN').toLowerCase();
  const email = requiredEnv('ADMIN_SEED_EMAIL').toLowerCase();
  const password = requiredEnv('ADMIN_SEED_PASSWORD');
  const firstName = requiredEnv('ADMIN_SEED_FIRST_NAME');
  const lastName = process.env.ADMIN_SEED_LAST_NAME?.trim() || null;

  if (password.length < 12) {
    throw new Error('ADMIN_SEED_PASSWORD must contain at least 12 characters');
  }

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
    const inserted = await database
      .insert(admins)
      .values({
        login,
        email,
        passwordHash: await hash(password),
        firstName,
        lastName,
        role: 'super_admin',
        permissions: Object.values(AdminPermission),
        status: 'active',
      })
      .onConflictDoNothing({ target: admins.email })
      .returning({ id: admins.id, login: admins.login });

    if (inserted.length === 0) {
      console.info(`Super admin ${login} already exists; nothing changed.`);
      return;
    }

    console.info(
      `Super admin ${inserted[0].login} created (${inserted[0].id}).`,
    );
  } finally {
    await pool.end();
  }
}

seedSuperAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
