import {
  boolean,
  bigint,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const countries = pgTable(
  'countries',
  {
    id: uuid('id').primaryKey(),
    legacyId: bigint('legacy_id', { mode: 'number' }),
    isoCode: varchar('iso_code', { length: 2 }),
    nameRu: varchar('name_ru', { length: 180 }).notNull(),
    nameUz: varchar('name_uz', { length: 180 }),
    nameEn: varchar('name_en', { length: 180 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('countries_legacy_id_unique').on(table.legacyId),
    uniqueIndex('countries_iso_code_unique').on(table.isoCode),
    index('countries_name_ru_idx').on(table.nameRu),
  ],
);

export const cities = pgTable(
  'cities',
  {
    id: uuid('id').primaryKey(),
    legacyId: bigint('legacy_id', { mode: 'number' }),
    legacyRegionId: bigint('legacy_region_id', { mode: 'number' }),
    countryId: uuid('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'restrict' }),
    nameRu: varchar('name_ru', { length: 180 }).notNull(),
    nameUz: varchar('name_uz', { length: 180 }),
    nameEn: varchar('name_en', { length: 180 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('cities_legacy_id_unique').on(table.legacyId),
    index('cities_country_name_ru_idx').on(table.countryId, table.nameRu),
  ],
);

export const airports = pgTable(
  'airports',
  {
    id: uuid('id').primaryKey(),
    iataCode: varchar('iata_code', { length: 3 }).notNull(),
    countryId: uuid('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'restrict' }),
    cityId: uuid('city_id').references(() => cities.id, {
      onDelete: 'set null',
    }),
    nameRu: varchar('name_ru', { length: 255 }),
    nameEn: varchar('name_en', { length: 255 }),
    latitude: numeric('latitude', { precision: 11, scale: 7 }).notNull(),
    longitude: numeric('longitude', { precision: 11, scale: 7 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('airports_iata_code_unique').on(table.iataCode),
    index('airports_country_idx').on(table.countryId),
    index('airports_city_idx').on(table.cityId),
  ],
);

export const featuredFlightLocations = pgTable(
  'featured_flight_locations',
  {
    code: varchar('code', { length: 3 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    countryName: varchar('country_name', { length: 180 }).notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('featured_flight_locations_order_idx').on(table.sortOrder)],
);

export type CountryRecord = typeof countries.$inferSelect;
export type CityRecord = typeof cities.$inferSelect;
export type AirportRecord = typeof airports.$inferSelect;
export type FeaturedFlightLocationRecord =
  typeof featuredFlightLocations.$inferSelect;
