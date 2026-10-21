import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { AdminPermission } from '../../domain/admin.types';

export const adminRole = pgEnum('admin_role', [
  'super_admin',
  'admin',
  'content_manager',
  'support_manager',
  'finance_manager',
]);
export const adminStatus = pgEnum('admin_status', ['active', 'blocked']);

export const admins = pgTable(
  'admins',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    login: varchar('login', { length: 80 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 80 }).notNull(),
    lastName: varchar('last_name', { length: 80 }),
    role: adminRole('role').notNull().default('admin'),
    permissions: jsonb('permissions')
      .$type<AdminPermission[]>()
      .notNull()
      .default([]),
    status: adminStatus('status').notNull().default('active'),
    tokenVersion: integer('token_version').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('admins_email_unique').on(table.email),
    uniqueIndex('admins_login_unique').on(table.login),
    uniqueIndex('admins_single_super_admin_unique')
      .on(table.role)
      .where(sql`${table.role} = 'super_admin'`),
    index('admins_status_idx').on(table.status),
    index('admins_role_idx').on(table.role),
  ],
);

export type AdminRecord = typeof admins.$inferSelect;
