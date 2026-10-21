import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { CurrencyCode, SupportedLocale } from '../../../../shared/domain/enums';
import { CustomerStatus } from '../../domain/customer.types';

export const customerStatus = pgEnum('user_status', ['active', 'blocked']);

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    phone: varchar('phone', { length: 32 }),
    email: varchar('email', { length: 255 }),
    passwordHash: varchar('password_hash', { length: 255 }),
    firstName: varchar('first_name', { length: 80 }).notNull(),
    lastName: varchar('last_name', { length: 80 }),
    middleName: varchar('middle_name', { length: 80 }),
    locale: varchar('locale', { length: 3 })
      .$type<SupportedLocale>()
      .notNull()
      .default(SupportedLocale.RU),
    currency: varchar('currency', { length: 3 })
      .$type<CurrencyCode>()
      .notNull()
      .default(CurrencyCode.RUB),
    timeZone: varchar('time_zone', { length: 64 })
      .notNull()
      .default('Europe/Moscow'),
    status: customerStatus('status')
      .$type<CustomerStatus>()
      .notNull()
      .default(CustomerStatus.ACTIVE),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('customers_phone_unique').on(table.phone),
    uniqueIndex('customers_email_unique').on(table.email),
    index('customers_status_idx').on(table.status),
  ],
);

export type CustomerRecord = typeof customers.$inferSelect;
export type NewCustomerRecord = typeof customers.$inferInsert;
