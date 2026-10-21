import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CreateProviderOrderInput,
  PaymentProviderPort,
  ProviderOrderResult,
  ProviderPaymentWebhook,
} from '../../application/payment-provider.port';
import { majorNumberToMinor, minorToMajorNumber } from './payment-amount';

interface RaiffeisenOrderResponse {
  payformUrl?: string;
}

interface RaiffeisenPaymentWebhookBody extends Record<string, unknown> {
  event: 'PAYMENT';
  data: {
    id: string;
    publicId: string;
    amount: number;
    order: { id: string };
    status: { value: string; date: string };
    paymentMethod: 'SBP' | 'ACQUIRING';
  };
}

@Injectable()
export class RaiffeisenPaymentProvider implements PaymentProviderPort {
  readonly name = 'raiffeisen';

  constructor(private readonly config: ConfigService) {}

  async createOrder(
    input: CreateProviderOrderInput,
  ): Promise<ProviderOrderResult> {
    const publicId = this.config.getOrThrow<string>('RAIFFEISEN_PUBLIC_ID');
    const baseUrl = this.config.getOrThrow<string>('RAIFFEISEN_BASE_URL');
    const response = await fetch(
      `${baseUrl}/api/v1/merchants/${encodeURIComponent(publicId)}/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: input.orderId,
          amount: minorToMajorNumber(input.amount),
          comment: input.title.slice(0, 140),
          paymentDetails: input.title.slice(0, 140),
          paymentMethods: ['SBP', 'ACQUIRING'],
          locale: 'RU',
          expirationDate: input.expiresAt,
          returnUrls: {
            successUrl: input.returnUrl,
            failUrl: input.returnUrl,
            successSbpUrl: input.returnUrl,
          },
        }),
        signal: AbortSignal.timeout(
          this.config.getOrThrow<number>('RAIFFEISEN_TIMEOUT_MS'),
        ),
      },
    );
    if (!response.ok) {
      throw new BadGatewayException({
        code: 'PAYMENT_PROVIDER_ORDER_FAILED',
        message: `Raiffeisen order failed with status ${response.status}`,
      });
    }
    const result = (await response.json()) as RaiffeisenOrderResponse;
    if (!result.payformUrl) {
      throw new BadGatewayException({
        code: 'PAYMENT_PROVIDER_RESPONSE_INVALID',
        message: 'Raiffeisen response has no payment URL',
      });
    }
    return { paymentUrl: result.payformUrl };
  }

  parseWebhook(
    signature: string,
    payload: Record<string, unknown>,
  ): ProviderPaymentWebhook {
    const webhook = payload as RaiffeisenPaymentWebhookBody;
    if (webhook.event !== 'PAYMENT' || !webhook.data?.status) {
      this.invalidWebhook();
    }
    const { data } = webhook;
    if (
      data.publicId !== this.config.getOrThrow<string>('RAIFFEISEN_PUBLIC_ID')
    ) {
      this.invalidWebhook();
    }
    const control = [
      data.amount,
      data.publicId,
      data.order.id,
      data.status.value,
      data.status.date,
    ].join('|');
    this.verifySignature(signature, control);
    return {
      eventKey: `${data.id}:${data.status.value}:${data.status.date}`,
      providerOrderId: data.order.id,
      providerPaymentId: data.id,
      amount: majorNumberToMinor(data.amount),
      status: this.status(data.status.value),
      statusCode: data.status.value,
      statusDate: data.status.date,
      paymentMethod: data.paymentMethod,
      raw: payload,
    };
  }

  private status(value: string): ProviderPaymentWebhook['status'] {
    if (value === 'SUCCESS') return 'succeeded';
    if (['DECLINED', 'FAILED', 'EXPIRED'].includes(value)) return 'failed';
    return 'processing';
  }

  private verifySignature(signature: string, control: string): void {
    const expected = createHmac('sha256', this.secretKey())
      .update(control)
      .digest('hex');
    const actualBuffer = Buffer.from(signature.toLowerCase(), 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      this.invalidWebhook();
    }
  }

  private secretKey(): string {
    return this.config.getOrThrow<string>('RAIFFEISEN_SECRET_KEY');
  }

  private invalidWebhook(): never {
    throw new UnauthorizedException({
      code: 'PAYMENT_WEBHOOK_SIGNATURE_INVALID',
      message: 'Payment webhook is invalid',
    });
  }
}
