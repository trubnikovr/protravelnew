import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCustomerProfile,
  updateCustomerProfile,
  type UpdateCustomerProfile,
} from '../api/profile.api';

export const customerProfileQueryKey = ['customer', 'profile'] as const;

export function useCustomerProfile(enabled = true) {
  return useQuery({
    queryKey: customerProfileQueryKey,
    queryFn: getCustomerProfile,
    enabled,
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCustomerProfile) => updateCustomerProfile(input),
    onSuccess: profile => {
      queryClient.setQueryData(customerProfileQueryKey, profile);
    },
  });
}
