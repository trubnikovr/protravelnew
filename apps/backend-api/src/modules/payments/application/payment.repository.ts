import type { Payment } from '../domain/payment';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(customerId: string, paymentId: string): Promise<Payment | null>;
  findByIdempotencyKey(
    customerId: string,
    idempotencyKey: string,
  ): Promise<Payment | null>;
  findByProviderOrderId(
    provider: string,
    providerOrderId: string,
  ): Promise<Payment | null>;
  recordWebhook(
    provider: string,
    eventKey: string,
    payload: Record<string, unknown>,
  ): Promise<boolean>;
}
