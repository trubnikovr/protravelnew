import { apiRequest, apiRequestWithMeta } from '../../../shared/api/api-client';
import type {
  CreateFlightSearchRequestDto,
  FeaturedFlightLocationResponseDto,
  FlightHighlightResponseDto,
  FlightFareRulesResponseDto,
  FlightOfferResponseDto,
  FlightShareLinkResponseDto,
  FlightSearchFiltersResponseDto,
  ReferenceSuggestionResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  CreateFlightSearchRequestDtoToJSON,
  FeaturedFlightLocationResponseDtoFromJSON,
  FlightHighlightResponseDtoFromJSON,
  FlightFareRulesResponseDtoFromJSON,
  FlightOfferResponseDtoFromJSON,
  FlightShareLinkResponseDtoFromJSON,
  FlightSearchFiltersResponseDtoFromJSON,
  ReferenceSuggestionResponseDtoFromJSON,
} from '../../../shared/api/generated/v1/models';

export async function suggestFlightPlaces(
  query: string,
): Promise<ReferenceSuggestionResponseDto[]> {
  const params = new URLSearchParams({
    q: query,
    types: 'city,airport',
    limit: '20',
  });
  const data = await apiRequest<unknown[]>(`/reference/suggest?${params}`);
  return data.map(ReferenceSuggestionResponseDtoFromJSON);
}

export async function searchFlights(
  request: CreateFlightSearchRequestDto,
): Promise<{
  offers: FlightOfferResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: FlightSearchFiltersResponseDto;
  highlights: FlightHighlightResponseDto[];
}> {
  const response = await apiRequestWithMeta<
    unknown[],
    { filters?: unknown; highlights?: unknown[] }
  >('/flights/search', {
    method: 'POST',
    body: JSON.stringify(CreateFlightSearchRequestDtoToJSON(request)),
  });
  return {
    offers: response.data.map(FlightOfferResponseDtoFromJSON),
    filters: response.meta?.filters
      ? FlightSearchFiltersResponseDtoFromJSON(response.meta.filters)
      : undefined,
    highlights:
      response.meta?.highlights?.map(FlightHighlightResponseDtoFromJSON) ?? [],
    pagination: response.meta?.pagination ?? {
      page: request.page ?? 1,
      limit: request.limit ?? response.data.length,
      total: response.data.length,
      totalPages: 1,
    },
  };
}

export async function getFlightOffer(
  offerId: string,
  signal?: AbortSignal,
): Promise<FlightOfferResponseDto> {
  const data = await apiRequest<unknown>(`/flights/offers/${offerId}`, {
    signal,
  });
  return FlightOfferResponseDtoFromJSON(data);
}

export async function getFlightFareRules(
  offerId: string,
): Promise<FlightFareRulesResponseDto> {
  return apiRequest<unknown>(`/flights/offers/${offerId}/fare-rules`).then(
    FlightFareRulesResponseDtoFromJSON,
  );
}

export async function createFlightShare(
  offerId: string,
): Promise<FlightShareLinkResponseDto> {
  return apiRequest<unknown>(`/flights/offers/${offerId}/share`, {
    method: 'POST',
  }).then(FlightShareLinkResponseDtoFromJSON);
}

export async function getAviaPopularPlaces(): Promise<
  FeaturedFlightLocationResponseDto[]
> {
  const data = await apiRequest<unknown[]>(
    '/reference/featured-flight-locations',
  );
  return data.map(FeaturedFlightLocationResponseDtoFromJSON);
}
