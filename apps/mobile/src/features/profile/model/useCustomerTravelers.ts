import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  createCustomerTraveler,
  deleteCustomerTraveler,
  listCustomerTravelers,
  type CreateCustomerTraveler,
} from '../api/travelers.api';

export const customerTravelersQueryKey = ['customer', 'travelers'] as const;

export function useCustomerTravelers() {
  return useQuery({
    queryKey: customerTravelersQueryKey,
    queryFn: listCustomerTravelers,
  });
}

export function useCreateCustomerTraveler() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomerTraveler) =>
      createCustomerTraveler(input),
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey: customerTravelersQueryKey}),
  });
}

export function useDeleteCustomerTraveler() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomerTraveler,
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey: customerTravelersQueryKey}),
  });
}
