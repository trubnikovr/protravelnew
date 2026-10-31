import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const travelFacts = pgTable(
  'travel_facts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    text: text('text').notNull(),
    countryCode: varchar('country_code', { length: 2 }),
    destinationCode: varchar('destination_code', { length: 3 }),
    tags: text('tags').array().notNull().default([]),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('travel_facts_country_published_idx').on(
      table.countryCode,
      table.isPublished,
    ),
    index('travel_facts_destination_published_idx').on(
      table.destinationCode,
      table.isPublished,
    ),
  ],
);

export type TravelFactRecord = typeof travelFacts.$inferSelect;
