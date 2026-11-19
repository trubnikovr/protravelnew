import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  createCustomerTraveler,
  createCustomerTravelerDocument,
  deleteCustomerTraveler,
  deleteCustomerTravelerDocument,
  listCustomerTravelers,
  updateCustomerTraveler,
  updateCustomerTravelerDocument,
  type CreateCustomerTraveler,
} from '../api/travelers.api';
import type {
  CreateTravelerDocumentRequestDto,
  UpdateTravelerDocumentRequestDto,
  UpdateTravelerRequestDto,
} from '../../../shared/api/generated/v1/models';

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

export function useUpdateCustomerTraveler() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ travelerId, input }: { travelerId: string; input: UpdateTravelerRequestDto }) =>
      updateCustomerTraveler(travelerId, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: customerTravelersQueryKey}),
  });
}

export function useCreateCustomerTravelerDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ travelerId, input }: { travelerId: string; input: CreateTravelerDocumentRequestDto }) =>
      createCustomerTravelerDocument(travelerId, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: customerTravelersQueryKey}),
  });
}

export function useUpdateCustomerTravelerDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ travelerId, documentId, input }: { travelerId: string; documentId: string; input: UpdateTravelerDocumentRequestDto }) =>
      updateCustomerTravelerDocument(travelerId, documentId, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: customerTravelersQueryKey}),
  });
}

export function useDeleteCustomerTravelerDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ travelerId, documentId }: { travelerId: string; documentId: string }) =>
      deleteCustomerTravelerDocument(travelerId, documentId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: customerTravelersQueryKey}),
  });
}
