import {
  index,
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
import { customers } from '../../../customers/infrastructure/persistence/customer.schema';
import {
  FlightOrderStatus,
  type FlightOrderContact,
  type FlightOrderOfferSnapshot,
  type FlightOrderTravelerSelection,
} from '../../domain/flight-order.types';

export const flightOrderStatus = pgEnum('flight_order_status', [
  'draft',
  'booking',
  'booked',
  'payment_pending',
  'paid',
  'failed',
  'cancelled',
  'expired',
]);
export const flightOrders = pgTable(
  'flight_orders',
  {
    id: uuid('id').primaryKey(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'restrict' }),
    offerId: uuid('offer_id').notNull(),
    idempotencyKey: varchar('idempotency_key', { length: 128 }).notNull(),
    status: flightOrderStatus('status').$type<FlightOrderStatus>().notNull(),
    provider: varchar('provider', { length: 32 }).notNull(),
    contact: jsonb('contact').$type<FlightOrderContact>().notNull(),
    travelers: jsonb('travelers')
      .$type<FlightOrderTravelerSelection[]>()
      .notNull(),
    offerSnapshot: jsonb('offer_snapshot')
      .$type<FlightOrderOfferSnapshot>()
      .notNull(),
    totalAmount: numeric('total_amount', { precision: 20, scale: 0 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    providerBookingToken: text('provider_booking_token'),
    recordLocator: varchar('record_locator', { length: 64 }),
    bookingExpiresAt: timestamp('booking_expires_at', { withTimezone: true }),
    providerStatus: varchar('provider_status', { length: 64 }),
    failureCode: varchar('failure_code', { length: 64 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('flight_orders_customer_idempotency_unique').on(
      table.customerId,
      table.idempotencyKey,
    ),
    index('flight_orders_customer_created_idx').on(
      table.customerId,
      table.createdAt,
    ),
    index('flight_orders_status_idx').on(table.status),
  ],
);

export type FlightOrderRecord = typeof flightOrders.$inferSelect;
