import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCustomerTourBooking,
  listCustomerTourBookings,
  type CreateCustomerTourBooking,
} from '../api/tour-bookings.api';

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
