import { index, jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { FlightOfferData } from '../../domain';

export const flightOffers = pgTable(
  'flight_offers',
  {
    id: uuid('id').primaryKey(),
    searchId: uuid('search_id').notNull(),
    data: jsonb('data').$type<FlightOfferData>().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('flight_offers_search_id_idx').on(table.searchId),
    index('flight_offers_expires_at_idx').on(table.expiresAt),
  ],
);

export type FlightOfferRecord = typeof flightOffers.$inferSelect;
