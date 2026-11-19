import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCustomerTourBooking,
  listCustomerTourBookings,
  quoteCustomerTourBooking,
  type CreateCustomerTourBooking,
} from '../api/tour-bookings.api';
import type { MoneyResponseDto } from '../../../shared/api/generated/v1/models';

export const customerTourBookingsQueryKey = [
  'customer',
  'tour-bookings',
] as const;

export function useCustomerTourBookings() {
  return useQuery({
    queryKey: customerTourBookingsQueryKey,
    queryFn: listCustomerTourBookings,
  });
}

export function useCreateCustomerTourBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomerTourBooking) =>
      createCustomerTourBooking(input),
    onSuccess: booking => {
      queryClient.setQueryData(customerTourBookingsQueryKey, current =>
        current ? [booking, ...(current as (typeof booking)[])] : [booking],
      );
    },
  });
}

export function useTourBookingPriceQuote(
  tourId: string,
  departureDate: Date | null,
  travelersCount: number,
  enabled = true,
) {
  const departure = departureDate?.toISOString().slice(0, 10) ?? null;
  return useQuery<MoneyResponseDto>({
    queryKey: ['customer', 'tour-booking-price-quote', tourId, departure, travelersCount],
    enabled: enabled && travelersCount > 0,
    queryFn: () => quoteCustomerTourBooking({
      tourId,
      travelersCount,
      departureDate,
    }),
  });
}
