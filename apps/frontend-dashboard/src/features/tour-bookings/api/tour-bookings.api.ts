import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import {
  AdminTourBookingsApi,
  type AdminTourBookingsListStatusEnum,
} from "@/shared/api/generated/v1/apis";
import type {
  CreateTourBookingRequestDto,
  TourBookingDocumentResponseDto,
  TourBookingResponseDto,
  TourBookingResponseDtoStatusEnum,
} from "@/shared/api/generated/v1/models";

const api = new AdminTourBookingsApi(
  createApiConfiguration(() => authSession.getToken())
);

export interface TourBookingsListFilters {
  page: number;
  limit: number;
  sortDirection: "asc" | "desc";
  search?: string;
  status?: AdminTourBookingsListStatusEnum;
}

export const tourBookingsQueryOptions = (filters: TourBookingsListFilters) =>
  queryOptions({
    queryKey: ["admin", "tour-bookings", filters] as const,
    queryFn: async () => {
      try {
        return await api.adminTourBookingsList(filters);
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export const tourBookingQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["admin", "tour-bookings", id] as const,
    queryFn: async (): Promise<TourBookingResponseDto> => {
      try {
        return (await api.adminTourBookingsGet({ id })).data;
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export async function createTourBooking(
  payload: CreateTourBookingRequestDto
): Promise<TourBookingResponseDto> {
  try {
    return (
      await api.adminTourBookingsCreate({
        createTourBookingRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function changeTourBookingStatus(
  id: string,
  status: TourBookingResponseDtoStatusEnum
): Promise<TourBookingResponseDto> {
  try {
    return (
      await api.adminTourBookingsChangeStatus({
        id,
        updateTourBookingStatusRequestDto: { status },
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function uploadTourBookingDocument(
  id: string,
  file: File
): Promise<TourBookingDocumentResponseDto> {
  try {
    return (await api.adminTourBookingsUploadDocument({ id, file })).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function deleteTourBookingDocument(
  bookingId: string,
  documentId: string
): Promise<void> {
  try {
    await api.adminTourBookingsDeleteDocument({ bookingId, documentId });
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function downloadTourBookingDocument(
  bookingId: string,
  documentId: string,
  originalName: string
): Promise<void> {
  try {
    const blob = await api.adminTourBookingsDownloadDocument({
      bookingId,
      documentId,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = originalName;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
