import { createHmac } from 'node:crypto';
import type { ConfigService } from '@nestjs/config';
import { RaiffeisenPaymentProvider } from './raiffeisen-payment.provider';

describe('RaiffeisenPaymentProvider', () => {
  const values: Record<string, string | number> = {
    RAIFFEISEN_PUBLIC_ID: 'public-id',
    RAIFFEISEN_SECRET_KEY: 'secret',
    RAIFFEISEN_BASE_URL: 'https://pay-test.raif.ru',
    RAIFFEISEN_TIMEOUT_MS: 15_000,
  };
  const config = {
    getOrThrow: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
  const provider = new RaiffeisenPaymentProvider(config);

  afterEach(() => jest.restoreAllMocks());

  it('creates one hosted form with SBP and card methods', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ payformUrl: 'https://pay.example/form' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const result = await provider.createOrder({
      orderId: 'payment-id',
      amount: '12345',
      title: 'Тур в Париж',
      expiresAt: '2026-08-20T12:00:00.000Z',
      returnUrl: 'protravel://payments/result?paymentId=payment-id',
    });
    expect(result.paymentUrl).toBe('https://pay.example/form');
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(request.body as string)).toMatchObject({
      amount: 123.45,
      paymentMethods: ['SBP', 'ACQUIRING'],
      returnUrls: {
        successUrl: 'protravel://payments/result?paymentId=payment-id',
        failUrl: 'protravel://payments/result?paymentId=payment-id',
        successSbpUrl: 'protravel://payments/result?paymentId=payment-id',
      },
    });
  });

  it('verifies webhook signature and maps a successful payment', () => {
    const payload = {
      event: 'PAYMENT',
      data: {
        id: 'provider-payment',
        publicId: 'public-id',
        amount: 123.45,
        order: { id: 'payment-id' },
        status: { value: 'SUCCESS', date: '2026-08-20T12:00:00.000Z' },
        paymentMethod: 'SBP',
      },
    };
    const signature = createHmac('sha256', 'secret')
      .update('123.45|public-id|payment-id|SUCCESS|2026-08-20T12:00:00.000Z')
      .digest('hex');
    expect(provider.parseWebhook(signature, payload)).toMatchObject({
      providerOrderId: 'payment-id',
      providerPaymentId: 'provider-payment',
      amount: '12345',
      status: 'succeeded',
      paymentMethod: 'SBP',
    });
  });
});
