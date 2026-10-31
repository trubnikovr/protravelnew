import { index, jsonb, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import type { FlightShareSnapshot } from '../../domain';

export const flightShares = pgTable(
  'flight_shares',
  {
    tokenHash: varchar('token_hash', { length: 64 }).primaryKey(),
    snapshot: jsonb('snapshot').$type<FlightShareSnapshot>().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('flight_shares_expires_at_idx').on(table.expiresAt)],
);

export type FlightShareRecord = typeof flightShares.$inferSelect;
