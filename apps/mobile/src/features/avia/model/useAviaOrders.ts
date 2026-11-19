import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { createAndBookFlightOrder } from '../api/avia-orders.api';
import type { CreateFlightOrderRequestDto } from '../../../shared/api/generated/v1/models';
import { ApiRequestError } from '../../../shared/api/api-errors';

const retryableBookingRejections = new Set([
  'FLIGHT_BOOKING_PHONE_MUST_DIFFER',
  'FLIGHT_BOOKING_PASSPORT_DATA_INVALID',
  'FLIGHT_CONTACT_EMAIL_REQUIRED',
  'FLIGHT_CONTACT_PHONE_REQUIRED',
  'FLIGHT_ORDER_PASSENGERS_MISMATCH',
  'BOOKING_TRAVELER_NOT_FOUND',
  'BOOKING_TRAVELER_INCOMPLETE',
  'FLIGHT_OFFER_NOT_FOUND',
  'FLIGHT_OFFER_UNAVAILABLE',
  'OFFER_EXPIRED',
]);

export function useCreateAndBookFlightOrder() {
  const attempt = useRef<{ request: string; key: string } | null>(null);
  return useMutation({ mutationFn: async (input: CreateFlightOrderRequestDto) => {
    const request = JSON.stringify(input);
    if (attempt.current?.request !== request) {
      attempt.current = { request, key: `flight-${Date.now()}-${Math.random().toString(36).slice(2)}` };
    }
    try {
      return await createAndBookFlightOrder(input, attempt.current.key);
    } catch (error) {
      if (error instanceof ApiRequestError && error.code && retryableBookingRejections.has(error.code)) attempt.current = null;
      throw error;
    }
  } });
}
