import type { PaymentMethod } from '../domain/payment.types';

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface CreateProviderOrderInput {
  orderId: string;
  amount: string;
  title: string;
  expiresAt: string;
  returnUrl: string;
}

export interface ProviderOrderResult {
  paymentUrl: string;
}

export interface ProviderPaymentWebhook {
  eventKey: string;
  providerOrderId: string;
  providerPaymentId: string;
  amount: string;
  status: 'processing' | 'succeeded' | 'failed';
  statusCode: string;
  statusDate: string;
  paymentMethod: PaymentMethod;
  raw: Record<string, unknown>;
}

export interface PaymentProviderPort {
  readonly name: 'raiffeisen' | 'mock';
  createOrder(input: CreateProviderOrderInput): Promise<ProviderOrderResult>;
  parseWebhook(
    signature: string,
    payload: Record<string, unknown>,
  ): ProviderPaymentWebhook;
}
