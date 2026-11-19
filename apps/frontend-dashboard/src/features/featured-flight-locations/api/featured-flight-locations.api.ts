import { queryOptions } from "@tanstack/react-query";
import { authSession } from "@/features/auth/model/auth-session";
import {
  ApiError,
  createApiConfiguration,
  normalizeApiError,
} from "@/shared/api/api-client";
import { AdminFeaturedFlightLocationsApi, ReferenceApi } from "@/shared/api/generated/v1/apis";
import type {
  FeaturedFlightLocationRequestDto,
  ReferenceSuggestionResponseDto,
} from "@/shared/api/generated/v1/models";

const api = new AdminFeaturedFlightLocationsApi(
  createApiConfiguration(() => authSession.getToken())
);
const referenceApi = new ReferenceApi(createApiConfiguration());

export const featuredFlightLocationsKey = [
  "admin",
  "featured-flight-locations",
] as const;

export const featuredFlightLocationsQueryOptions = () =>
  queryOptions({
    queryKey: featuredFlightLocationsKey,
    queryFn: async () => {
      try {
        const locations = (await api.adminFeaturedFlightLocationsList()).data;
        if (
          locations.some(
            (location) =>
              !location.cityId ||
              !location.name ||
              !Array.isArray(location.airportCodes)
          )
        ) {
          throw new ApiError(
            0,
            "STALE_FEATURED_FLIGHT_LOCATIONS_API",
            "Backend API is outdated for featured cities; apply migration 0030 and restart the backend."
          );
        }
        return locations;
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

export async function suggestFeaturedCities(q: string): Promise<ReferenceSuggestionResponseDto[]> {
  return (await referenceApi.referenceSuggest({ q, types: ["city"], limit: 12 })).data;
}
