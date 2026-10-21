import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { SystemMessageType } from '../../domain/system-message';

export const systemMessages = pgTable(
  'system_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    text: text('text').notNull(),
    type: varchar('type', { length: 16 }).$type<SystemMessageType>().notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('system_messages_active_updated_idx').on(
      table.isActive,
      table.updatedAt,
    ),
  ],
);

export type SystemMessageRecord = typeof systemMessages.$inferSelect;
