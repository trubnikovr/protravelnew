import {
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { customers } from '../../../customers/infrastructure/persistence/customer.schema';
import {
  PaymentPayableType,
  PaymentStatus,
  type PaymentMethod,
} from '../../domain/payment.types';
import type { CurrencyCode } from '@shared/domain/enums';

export const paymentPayableType = pgEnum('payment_payable_type', [
  PaymentPayableType.TOUR_BOOKING,
  PaymentPayableType.FLIGHT_ORDER,
]);

export const paymentStatus = pgEnum('payment_status', [
  PaymentStatus.CREATING,
  PaymentStatus.PENDING,
  PaymentStatus.PROCESSING,
  PaymentStatus.SUCCEEDED,
  PaymentStatus.FAILED,
  PaymentStatus.EXPIRED,
  PaymentStatus.REFUND_PENDING,
  PaymentStatus.PARTIALLY_REFUNDED,
  PaymentStatus.REFUNDED,
]);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'restrict' }),
    payableType: paymentPayableType('payable_type')
      .$type<PaymentPayableType>()
      .notNull(),
    payableId: uuid('payable_id').notNull(),
    idempotencyKey: varchar('idempotency_key', { length: 128 }).notNull(),
    status: paymentStatus('status').$type<PaymentStatus>().notNull(),
    totalAmount: numeric('total_amount', { precision: 20, scale: 0 }).notNull(),
    currency: varchar('currency', { length: 3 })
      .$type<CurrencyCode>()
      .notNull(),
    provider: varchar('provider', { length: 32 }).notNull(),
    providerOrderId: varchar('provider_order_id', { length: 40 }).notNull(),
    providerPaymentId: varchar('provider_payment_id', { length: 128 }),
    paymentMethod: varchar('payment_method', {
      length: 32,
    }).$type<PaymentMethod>(),
    paymentUrl: varchar('payment_url', { length: 2048 }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    failureCode: varchar('failure_code', { length: 128 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('payments_customer_idempotency_unique').on(
      table.customerId,
      table.idempotencyKey,
    ),
    uniqueIndex('payments_provider_order_unique').on(
      table.provider,
      table.providerOrderId,
    ),
    index('payments_payable_idx').on(table.payableType, table.payableId),
    index('payments_customer_created_idx').on(
      table.customerId,
      table.createdAt,
    ),
  ],
);

export const paymentWebhooks = pgTable(
  'payment_webhooks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    provider: varchar('provider', { length: 32 }).notNull(),
    eventKey: varchar('event_key', { length: 255 }).notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('payment_webhooks_provider_event_unique').on(
      table.provider,
      table.eventKey,
    ),
  ],
);

export type PaymentRecord = typeof payments.$inferSelect;
