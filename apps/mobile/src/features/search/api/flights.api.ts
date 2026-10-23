import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateFlightSearchRequestDto,
  FlightOfferResponseDto,
  ReferenceSuggestionResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  CreateFlightSearchRequestDtoToJSON,
  FlightOfferResponseDtoFromJSON,
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
): Promise<FlightOfferResponseDto[]> {
  const data = await apiRequest<unknown[]>('/flights/searches', {
    method: 'POST',
    body: JSON.stringify(CreateFlightSearchRequestDtoToJSON(request)),
  });
  return data.map(FlightOfferResponseDtoFromJSON);
}
