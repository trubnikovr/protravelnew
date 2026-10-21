import type { CurrencyCode } from '@shared/domain/enums';

export enum PaymentPayableType {
  TOUR_BOOKING = 'tour_booking',
  FLIGHT_ORDER = 'flight_order',
}

export enum PaymentStatus {
  CREATING = 'creating',
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  EXPIRED = 'expired',
  REFUND_PENDING = 'refund_pending',
  PARTIALLY_REFUNDED = 'partially_refunded',
  REFUNDED = 'refunded',
}

export type PaymentMethod = 'SBP' | 'ACQUIRING';

export interface PaymentMoney {
  amount: string;
  currency: CurrencyCode;
}
