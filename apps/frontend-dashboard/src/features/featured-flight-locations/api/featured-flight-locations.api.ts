import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import { AdminFeaturedFlightLocationsApi } from "@/shared/api/generated/v1/apis";
import type { FeaturedFlightLocationRequestDto } from "@/shared/api/generated/v1/models";

const api = new AdminFeaturedFlightLocationsApi(
  createApiConfiguration(() => authSession.getToken())
);

export const featuredFlightLocationsKey = [
  "admin",
  "featured-flight-locations",
] as const;

export const featuredFlightLocationsQueryOptions = () =>
  queryOptions({
    queryKey: featuredFlightLocationsKey,
    queryFn: async () => {
      try {
        return (await api.adminFeaturedFlightLocationsList()).data;
      } catch (error) {
        throw await normalizeApiError(error);
      }
    },
  });

export async function replaceFeaturedFlightLocations(
  items: FeaturedFlightLocationRequestDto[]
) {
  try {
    return (
      await api.adminFeaturedFlightLocationsReplace({
        featuredFlightLocationRequestDto: items,
      })
    ).data;
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
