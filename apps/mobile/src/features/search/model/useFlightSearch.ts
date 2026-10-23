import { useQuery } from '@tanstack/react-query';
import type { CreateFlightSearchRequestDto } from '../../../shared/api/generated/v1/models';
import { searchFlights, suggestFlightPlaces } from '../api/flights.api';

export function useFlightPlaceSuggestions(query: string) {
  const normalized = query.trim();
  return useQuery({
    queryKey: ['flight-places', normalized],
    queryFn: () => suggestFlightPlaces(normalized),
    enabled: normalized.length > 0,
  });
}

export function useFlightSearch(request: CreateFlightSearchRequestDto) {
  return useQuery({
    queryKey: ['flight-search', request],
    queryFn: () => searchFlights(request),
    staleTime: 0,
  });
}
