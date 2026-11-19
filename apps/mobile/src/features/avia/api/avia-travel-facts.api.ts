import { apiRequest } from '../../../shared/api/api-client';
import {
  TravelFactResponseDtoFromJSON,
  type TravelFactResponseDto,
} from '../../../shared/api/generated/v1/models';

export async function getTravelFacts(
  destinationCode: string,
  signal?: AbortSignal,
): Promise<TravelFactResponseDto[]> {
  const params = new URLSearchParams({ destinationCode, limit: '5' });
  const data = await apiRequest<unknown[]>(`/travel-facts?${params}`, {
    signal,
  });
  return data.map(TravelFactResponseDtoFromJSON);
}
