import { useMutation } from '@tanstack/react-query';
import { createAndBookFlightOrder } from '../api/flight-orders.api';

export function useCreateAndBookFlightOrder() {
  return useMutation({ mutationFn: createAndBookFlightOrder });
}
