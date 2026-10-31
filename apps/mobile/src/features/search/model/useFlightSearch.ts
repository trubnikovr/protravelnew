import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { CreateFlightSearchRequestDto } from '../../../shared/api/generated/v1/models';
import {
  getFlightOffer,
  getFlightFareRules,
  searchFlights,
  suggestFlightPlaces,
} from '../api/flights.api';

export function useFlightPlaceSuggestions(query: string) {
  const normalized = query.trim();
  return useQuery({
    queryKey: ['flight-places', normalized],
    queryFn: () => suggestFlightPlaces(normalized),
    enabled: normalized.length > 0,
  });
}

export function useFlightSearch(request: CreateFlightSearchRequestDto) {
  return useInfiniteQuery({
    queryKey: ['flight-search-pages-v2', request],
    queryFn: ({ pageParam }) =>
      searchFlights({ ...request, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    staleTime: 0,
  });
}

export function useFlightOffer(offerId: string) {
  return useQuery({
    queryKey: ['flight-offer', offerId],
    queryFn: ({ signal }) => getFlightOffer(offerId, signal),
    staleTime: 30 * 1000,
  });
}

export function useFlightFareRules(offerId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['flight-fare-rules', offerId],
    queryFn: () => getFlightFareRules(offerId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
