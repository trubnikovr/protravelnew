export interface PaymentSucceededPayloadV1 {
  payableType: 'tour_booking' | 'flight_order';
  payableId: string;
  provider: 'raiffeisen' | 'mock';
  providerPaymentId: string;
  amount: {
    amount: string;
    currency: 'RUB';
  };
  paidAt: string;
}

export interface PaymentSucceededEventV1 {
  readonly eventId: string;
  readonly name: 'payment.succeeded.v1';
  readonly version: 1;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: PaymentSucceededPayloadV1;
}
