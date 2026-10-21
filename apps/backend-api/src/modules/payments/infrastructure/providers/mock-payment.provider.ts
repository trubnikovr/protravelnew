import { Injectable } from '@nestjs/common';
import type {
  CreateProviderOrderInput,
  PaymentProviderPort,
  ProviderOrderResult,
  ProviderPaymentWebhook,
} from '../../application/payment-provider.port';

@Injectable()
export class MockPaymentProvider implements PaymentProviderPort {
  readonly name = 'mock';

  createOrder(input: CreateProviderOrderInput): Promise<ProviderOrderResult> {
    return Promise.resolve({
      paymentUrl: `https://example.com/protravel/mock-payment/${input.orderId}`,
    });
  }

  parseWebhook(): ProviderPaymentWebhook {
    throw new Error('Mock provider does not accept Raiffeisen webhooks');
  }
}
