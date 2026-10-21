import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import {
  AdminCustomersApi,
  AdminCustomersTravelersApi,
  type AdminCustomersListSortByEnum,
  type AdminCustomersListSortDirectionEnum,
  type AdminCustomersListStatusEnum,
  type AdminCustomerTravelersListSortByEnum,
} from "@/shared/api/generated/v1/apis";
import type {
  CreateCustomerRequestDto,
  CreateTravelerDocumentRequestDto,
  CreateTravelerRequestDto,
  CustomerResponseDto,
  TravelerResponseDto,
  UpdateCustomerRequestDto,
  UpdateTravelerDocumentRequestDto,
  UpdateTravelerRequestDto,
} from "@/shared/api/generated/v1/models";

const configuration = createApiConfiguration(() => authSession.getToken());
const customersApi = new AdminCustomersApi(configuration);
const travelersApi = new AdminCustomersTravelersApi(configuration);

export interface CustomersListFilters {
  page: number;
  limit: number;
  sortBy: AdminCustomersListSortByEnum;
  sortDirection: AdminCustomersListSortDirectionEnum;
  status?: AdminCustomersListStatusEnum;
  search?: string;
}

export const customersQueryOptions = (filters: CustomersListFilters) =>
  queryOptions({
    queryKey: ["admin", "customers", filters] as const,
    queryFn: async () => {
      try {
        return await customersApi.adminCustomersList(filters);
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export const customerQueryOptions = (customerId: string) =>
  queryOptions({
    queryKey: ["admin", "customers", customerId] as const,
    queryFn: async (): Promise<CustomerResponseDto> => {
      try {
        return (await customersApi.adminCustomersGet({ customerId })).data;
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export const travelersQueryOptions = (customerId: string, page = 1) =>
  queryOptions({
    queryKey: ["admin", "customers", customerId, "travelers", page] as const,
    queryFn: async () => {
      try {
        return await travelersApi.adminCustomerTravelersList({
          customerId,
          page,
          limit: 20,
          sortBy: "createdAt" as AdminCustomerTravelersListSortByEnum,
          sortDirection: "desc",
        });
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export async function updateCustomerStatus(
  customerId: string,
  status: "active" | "blocked"
): Promise<CustomerResponseDto> {
  try {
    return (
      await customersApi.adminCustomersUpdateStatus({
        customerId,
        updateCustomerStatusRequestDto: { status },
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function createCustomer(
  payload: CreateCustomerRequestDto
): Promise<CustomerResponseDto> {
  try {
    return (
      await customersApi.adminCustomersCreate({
        createCustomerRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function updateCustomer(
  customerId: string,
  payload: UpdateCustomerRequestDto
): Promise<CustomerResponseDto> {
  try {
    return (
      await customersApi.adminCustomersUpdate({
        customerId,
        updateCustomerRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function deleteCustomer(customerId: string): Promise<void> {
  try {
    await customersApi.adminCustomersDelete({ customerId });
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function createTraveler(
  customerId: string,
  payload: CreateTravelerRequestDto
): Promise<TravelerResponseDto> {
  try {
    return (
      await travelersApi.adminCustomerTravelersCreate({
        customerId,
        createTravelerRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function updateTraveler(
  customerId: string,
  travelerId: string,
  payload: UpdateTravelerRequestDto
): Promise<TravelerResponseDto> {
  try {
    return (
      await travelersApi.adminCustomerTravelersUpdate({
        customerId,
        travelerId,
        updateTravelerRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function deleteTraveler(
  customerId: string,
  travelerId: string
): Promise<void> {
  try {
    await travelersApi.adminCustomerTravelersDelete({ customerId, travelerId });
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function createTravelerDocument(
  customerId: string,
  travelerId: string,
  payload: CreateTravelerDocumentRequestDto
): Promise<TravelerResponseDto> {
  try {
    return (
      await travelersApi.adminCustomerTravelersAddDocument({
        customerId,
        travelerId,
        createTravelerDocumentRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function updateTravelerDocument(
  customerId: string,
  travelerId: string,
  documentId: string,
  payload: UpdateTravelerDocumentRequestDto
): Promise<TravelerResponseDto> {
  try {
    return (
      await travelersApi.adminCustomerTravelersUpdateDocument({
        customerId,
        travelerId,
        documentId,
        updateTravelerDocumentRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function deleteTravelerDocument(
  customerId: string,
  travelerId: string,
  documentId: string
): Promise<void> {
  try {
    await travelersApi.adminCustomerTravelersDeleteDocument({
      customerId,
      travelerId,
      documentId,
    });
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
