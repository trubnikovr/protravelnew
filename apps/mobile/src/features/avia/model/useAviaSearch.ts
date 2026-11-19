import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import type { CreateFlightSearchRequestDto } from '../../../shared/api/generated/v1/models';
import {
  getFlightOffer,
  getFlightFareRules,
  searchFlights,
  suggestFlightPlaces,
} from '../api/avia.api';

export function useAviaPlaceSuggestions(query: string) {
  const normalized = query.trim();
  return useQuery({
    queryKey: ['flight-places', normalized],
    queryFn: () => suggestFlightPlaces(normalized),
    enabled: normalized.length > 0,
  });
}

export type AviaSearchPage = Awaited<ReturnType<typeof searchFlights>>;

export type UseAviaSearchResult = UseInfiniteQueryResult<
  InfiniteData<AviaSearchPage>,
  Error
> & {
  offers: AviaSearchPage['offers'];
  highlights: AviaSearchPage['highlights'];
  filters: AviaSearchPage['filters'];
};

export function useAviaSearch(
  request: CreateFlightSearchRequestDto,
  searchSession: string,
): UseAviaSearchResult {
  const search = useInfiniteQuery({
    queryKey: ['flight-search-pages-v2', searchSession, request],
    queryFn: ({ pageParam }) =>
      searchFlights({ ...request, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    ...search,
    offers: search.data?.pages.flatMap(page => page.offers) ?? [],
    highlights: search.data?.pages.flatMap(page => page.highlights) ?? [],
    // Backend filter metadata covers the complete result set across all pages.
    filters: search.data?.pages[0]?.filters,
  };
}

export function useAviaOffer(offerId: string) {
  return useQuery({
    queryKey: ['flight-offer', offerId],
    queryFn: ({ signal }) => getFlightOffer(offerId, signal),
    staleTime: 30 * 1000,
  });
}

export function useAviaFareRules(offerId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['flight-fare-rules', offerId],
    queryFn: () => getFlightFareRules(offerId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
