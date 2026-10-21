import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPayment,
  getPayment,
  type CreatePayment,
  type Payment,
} from '../api/payments.api';
import { openHostedPayment } from '../lib/open-hosted-payment';

const TERMINAL_STATUSES = new Set([
  'succeeded',
  'failed',
  'expired',
  'partially_refunded',
  'refunded',
]);

function idempotencyKey(input: CreatePayment): string {
  return `${input.payableType}:${input.payableId}:${Date.now()}`;
}

async function waitForPayment(payment: Payment): Promise<Payment> {
  let current = payment;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (TERMINAL_STATUSES.has(current.status)) return current;
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
    current = await getPayment(payment.id);
  }
  return current;
}

export function useHostedPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePayment) => {
      const payment = await createPayment(input, idempotencyKey(input));
      if (payment.status !== 'succeeded') {
        if (!payment.paymentUrl) throw new Error('PAYMENT_URL_MISSING');
        await openHostedPayment(payment.paymentUrl);
      }
      return waitForPayment(payment);
    },
    onSuccess: payment => {
      if (payment.payableType === 'tour_booking') {
        queryClient.invalidateQueries({
          queryKey: ['customer', 'tour-bookings'],
        });
      }
    },
  });
}
