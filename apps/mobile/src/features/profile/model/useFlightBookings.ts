import { useQuery } from '@tanstack/react-query';
import { listCustomerFlightBookings } from '../api/flight-bookings.api';

export function useFlightBookings() {
  return useQuery({
    queryKey: ['customer', 'flight-bookings'],
    queryFn: listCustomerFlightBookings,
  });
}
