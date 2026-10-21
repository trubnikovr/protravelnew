import {
  index,
  integer,
  date,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { admins } from '../../../admin/infrastructure/persistence/admin.schema';
import { tours } from '../../../tours/infrastructure/persistence/tour.schema';
import { customers } from '../../../customers/infrastructure/persistence/customer.schema';
import {
  travelerGender,
  travelers,
} from '../../../customers/submodules/customer-travelers/infrastructure/persistence/traveler.schema';
import { TourBookingStatus } from '../../domain/tour-booking.types';
import type { CurrencyCode } from '@shared/domain/enums';

export const tourBookingStatus = pgEnum('tour_booking_status', [
  'pending',
  'confirmed',
  'awaiting_payment',
  'paid',
  'completed',
  'cancelled',
]);

export const tourBookings = pgTable(
  'tour_bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingNumber: varchar('booking_number', { length: 32 }).notNull(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'restrict' }),
    tourId: uuid('tour_id')
      .notNull()
      .references(() => tours.id, { onDelete: 'restrict' }),
    customerName: varchar('customer_name', { length: 255 })
      .notNull()
      .default(''),
    customerEmail: varchar('customer_email', { length: 255 }),
    customerPhone: varchar('customer_phone', { length: 32 }),
    tourTitle: varchar('tour_title', { length: 255 }).notNull().default(''),
    status: tourBookingStatus('status')
      .$type<TourBookingStatus>()
      .notNull()
      .default(TourBookingStatus.PENDING),
    travelersCount: integer('travelers_count').notNull(),
    departureDate: date('departure_date'),
    totalAmount: numeric('total_amount', { precision: 18, scale: 0 }).notNull(),
    currency: varchar('currency', { length: 3 })
      .$type<CurrencyCode>()
      .notNull(),
    notes: text('notes'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('tour_bookings_number_unique').on(table.bookingNumber),
    index('tour_bookings_customer_idx').on(table.customerId),
    index('tour_bookings_tour_idx').on(table.tourId),
    index('tour_bookings_status_created_idx').on(table.status, table.createdAt),
  ],
);

export const tourBookingTravelers = pgTable(
  'tour_booking_travelers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => tourBookings.id, { onDelete: 'cascade' }),
    travelerId: uuid('traveler_id').references(() => travelers.id, {
      onDelete: 'set null',
    }),
    firstName: varchar('first_name', { length: 80 }).notNull(),
    lastName: varchar('last_name', { length: 80 }).notNull(),
    middleName: varchar('middle_name', { length: 80 }),
    gender: travelerGender('gender').notNull(),
    birthDate: date('birth_date'),
    citizenshipCountryCode: varchar('citizenship_country_code', { length: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('tour_booking_travelers_booking_idx').on(table.bookingId),
    index('tour_booking_travelers_traveler_idx').on(table.travelerId),
  ],
);

export const tourBookingDocuments = pgTable(
  'tour_booking_documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => tourBookings.id, { onDelete: 'cascade' }),
    originalName: varchar('original_name', { length: 255 }).notNull(),
    storageKey: varchar('storage_key', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 127 }).notNull(),
    size: integer('size').notNull(),
    uploadedByAdminId: uuid('uploaded_by_admin_id')
      .notNull()
      .references(() => admins.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('tour_booking_documents_storage_key_unique').on(
      table.storageKey,
    ),
    index('tour_booking_documents_booking_created_idx').on(
      table.bookingId,
      table.createdAt,
    ),
  ],
);

export type TourBookingRecord = typeof tourBookings.$inferSelect;
export type TourBookingDocumentRecord =
  typeof tourBookingDocuments.$inferSelect;
export type TourBookingTravelerRecord =
  typeof tourBookingTravelers.$inferSelect;
