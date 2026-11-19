import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  airports,
  cities,
  countries,
} from '../../../../core/submodules/reference/infrastructure/persistence/reference.schema';
import type { TourCurrency } from '../../domain/tour.types';

export const tourStatus = pgEnum('tour_status', [
  'draft',
  'published',
  'archived',
]);

export const tourType = pgEnum('tour_type', ['package', 'excursion']);

export const tourMealType = pgEnum('tour_meal_type', [
  'room_only',
  'breakfast',
  'half_board',
  'full_board',
  'all_inclusive',
]);

export const tours = pgTable(
  'tours',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 160 }).notNull(),
    status: tourStatus('status').notNull().default('draft'),
    type: tourType('type').notNull(),
    minTravelers: integer('min_travelers'),
    maxTravelers: integer('max_travelers'),
    durationDays: integer('duration_days').notNull(),
    durationNights: integer('duration_nights').notNull(),
    basePriceAmount: numeric('base_price_amount', {
      precision: 18,
      scale: 0,
    }).notNull(),
    currency: varchar('currency', { length: 3 })
      .$type<TourCurrency>()
      .notNull(),
    coverImageUrl: text('cover_image_url'),
    activeFrom: date('active_from'),
    activeTo: date('active_to'),
    isFeatured: boolean('is_featured').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('tours_slug_unique').on(table.slug),
    index('tours_status_idx').on(table.status),
    index('tours_type_idx').on(table.type),
    index('tours_featured_sort_idx').on(table.isFeatured, table.sortOrder),
  ],
);

export const tourContent = pgTable('tour_content', {
  tourId: uuid('tour_id')
    .primaryKey()
    .references(() => tours.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 180 }).notNull(),
  shortDescription: varchar('short_description', { length: 500 }).notNull(),
  description: text('description').notNull(),
  inclusions: jsonb('inclusions').$type<string[]>().notNull().default([]),
  exclusions: jsonb('exclusions').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tourDestinations = pgTable(
  'tour_destinations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tourId: uuid('tour_id')
      .notNull()
      .references(() => tours.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    countryId: uuid('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'restrict' }),
    cityId: uuid('city_id').references(() => cities.id, {
      onDelete: 'restrict',
    }),
    arrivalAirportId: uuid('arrival_airport_id').references(() => airports.id, {
      onDelete: 'restrict',
    }),
    nights: integer('nights'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('tour_destinations_tour_position_unique').on(
      table.tourId,
      table.position,
    ),
    index('tour_destinations_country_idx').on(table.countryId),
    index('tour_destinations_city_idx').on(table.cityId),
  ],
);

export const tourDepartures = pgTable(
  'tour_departures',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tourId: uuid('tour_id')
      .notNull()
      .references(() => tours.id, { onDelete: 'cascade' }),
    departureDate: date('departure_date').notNull(),
    returnDate: date('return_date'),
    departureCityId: uuid('departure_city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'restrict' }),
    departureAirportId: uuid('departure_airport_id').references(
      () => airports.id,
      { onDelete: 'restrict' },
    ),
    arrivalAirportId: uuid('arrival_airport_id').references(() => airports.id, {
      onDelete: 'restrict',
    }),
    priceAmount: numeric('price_amount', {
      precision: 18,
      scale: 0,
    }).notNull(),
    currency: varchar('currency', { length: 3 })
      .$type<TourCurrency>()
      .notNull(),
    seatsTotal: integer('seats_total'),
    seatsAvailable: integer('seats_available'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('tour_departures_variant_unique').on(
      table.tourId,
      table.departureDate,
      table.departureCityId,
      table.departureAirportId,
    ),
    index('tour_departures_date_idx').on(table.departureDate),
    index('tour_departures_city_idx').on(table.departureCityId),
  ],
);

export const tourPackageDetails = pgTable('tour_package_details', {
  tourId: uuid('tour_id')
    .primaryKey()
    .references(() => tours.id, { onDelete: 'cascade' }),
  hotelName: varchar('hotel_name', { length: 255 }).notNull(),
  hotelCategory: integer('hotel_category'),
  mealType: tourMealType('meal_type').notNull(),
  transferIncluded: boolean('transfer_included').notNull().default(false),
  insuranceIncluded: boolean('insurance_included').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tourExcursionDetails = pgTable('tour_excursion_details', {
  tourId: uuid('tour_id')
    .primaryKey()
    .references(() => tours.id, { onDelete: 'cascade' }),
  guideLanguage: varchar('guide_language', { length: 80 })
    .notNull()
    .default('Русский'),
  groupSizeMax: integer('group_size_max'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tourProgramDays = pgTable(
  'tour_program_days',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tourId: uuid('tour_id')
      .notNull()
      .references(() => tours.id, { onDelete: 'cascade' }),
    dayNumber: integer('day_number').notNull(),
    title: varchar('title', { length: 180 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('tour_program_days_tour_day_unique').on(
      table.tourId,
      table.dayNumber,
    ),
  ],
);

export const tourImages = pgTable(
  'tour_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tourId: uuid('tour_id')
      .notNull()
      .references(() => tours.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('tour_images_tour_sort_idx').on(table.tourId, table.sortOrder),
  ],
);

export type TourRecord = typeof tours.$inferSelect;
export type TourContentRecord = typeof tourContent.$inferSelect;
export type TourDestinationRecord = typeof tourDestinations.$inferSelect;
export type TourDepartureRecord = typeof tourDepartures.$inferSelect;
export type TourPackageDetailsRecord = typeof tourPackageDetails.$inferSelect;
export type TourExcursionDetailsRecord =
  typeof tourExcursionDetails.$inferSelect;
export type TourProgramDayRecord = typeof tourProgramDays.$inferSelect;
export type TourImageRecord = typeof tourImages.$inferSelect;
