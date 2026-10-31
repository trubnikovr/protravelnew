import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import { AdminTravelFactsApi } from "@/shared/api/generated/v1/apis";
import type {
  CreateTravelFactRequestDto,
  UpdateTravelFactRequestDto,
} from "@/shared/api/generated/v1/models";

const api = new AdminTravelFactsApi(
  createApiConfiguration(() => authSession.getToken())
);

export const travelFactsQueryKey = ["admin", "travel-facts"] as const;

export const travelFactsQueryOptions = () =>
  queryOptions({
    queryKey: travelFactsQueryKey,
    queryFn: async () => {
      try {
        return (await api.adminTravelFactsList()).data;
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export async function createTravelFact(payload: CreateTravelFactRequestDto) {
  try {
    return (
      await api.adminTravelFactsCreate({ createTravelFactRequestDto: payload })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function updateTravelFact(
  id: string,
  payload: UpdateTravelFactRequestDto
) {
  try {
    return (
      await api.adminTravelFactsUpdate({
        id,
        updateTravelFactRequestDto: payload,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}

export async function deleteTravelFact(id: string) {
  try {
    await api.adminTravelFactsDelete({ id });
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
