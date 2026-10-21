import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import {
  AdminFilesApi,
  AdminToursApi,
  ReferenceApi,
} from "@/shared/api/generated/v1/apis";
import type {
  CreateTourRequestDto,
  ReferenceSuggestionResponseDtoTypeEnum,
  TourResponseDtoStatusEnum,
  TourResponseDtoTypeEnum,
} from "@/shared/api/generated/v1/models";

const filesApi = new AdminFilesApi(
  createApiConfiguration(() => authSession.getToken())
);
const toursApi = new AdminToursApi(
  createApiConfiguration(() => authSession.getToken())
);
const referenceApi = new ReferenceApi(createApiConfiguration());

export interface ToursListFilters {
  page: number;
  limit: number;
  sortBy: "createdAt" | "updatedAt" | "sortOrder" | "price" | "durationDays";
  sortDirection: "asc" | "desc";
  status?: TourResponseDtoStatusEnum;
  type?: TourResponseDtoTypeEnum;
  search?: string;
}

export const listTours = (filters: ToursListFilters) =>
  toursApi.adminToursList(filters);

export const toursQueryOptions = (filters: ToursListFilters) =>
  queryOptions({
    queryKey: ["admin", "tours", filters] as const,
    queryFn: () => listTours(filters),
  });

export const createTour = async (payload: CreateTourRequestDto) =>
  (await toursApi.adminToursCreate({ createTourRequestDto: payload })).data;

export const updateTour = async (id: string, payload: CreateTourRequestDto) =>
  (await toursApi.adminToursUpdate({ id, updateTourRequestDto: payload })).data;

export const deleteTour = (id: string) => toursApi.adminToursDelete({ id });

export async function suggestReferences(
  q: string,
  types: ReferenceSuggestionResponseDtoTypeEnum[],
  countryId?: string
) {
  return (
    await referenceApi.referenceSuggest({
      q,
      types,
      countryId,
      limit: 12,
    })
  ).data;
}

export async function uploadTourImage(file: File): Promise<string> {
  try {
    return (await filesApi.adminFilesUploadImage({ file })).data.url;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
