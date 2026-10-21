import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreatePaymentRequestDto,
  PaymentResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  CreatePaymentRequestDtoToJSON,
  PaymentResponseDtoFromJSON,
} from '../../../shared/api/generated/v1/models';

export type Payment = PaymentResponseDto;
export type CreatePayment = CreatePaymentRequestDto;

export function createPayment(
  input: CreatePayment,
  idempotencyKey: string,
): Promise<Payment> {
  return apiRequest<unknown>('/me/payments', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(CreatePaymentRequestDtoToJSON(input)),
  }).then(PaymentResponseDtoFromJSON);
}

export function getPayment(paymentId: string): Promise<Payment> {
  return apiRequest<unknown>(`/me/payments/${paymentId}`).then(
    PaymentResponseDtoFromJSON,
  );
}
