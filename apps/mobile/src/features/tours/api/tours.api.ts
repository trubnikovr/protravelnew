import { apiRequest } from '../../../shared/api/api-client';
import type {
  PublicTourListItemResponseDto,
  PublicTourResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  PublicTourListItemResponseDtoFromJSON,
  PublicTourResponseDtoFromJSON,
} from '../../../shared/api/generated/v1/models';

export type TourListItem = PublicTourListItemResponseDto;
export type TourDetails = PublicTourResponseDto;
export type TourSort = 'recommended' | 'price';

export type TourListFilters = {
  destination?: string;
  sort?: TourSort;
};

export async function getTours(
  filters: TourListFilters,
): Promise<TourListItem[]> {
  const query = new URLSearchParams({ limit: '100' });
  if (filters.destination) query.set('destination', filters.destination);
  if (filters.sort) query.set('sort', filters.sort);
  const data = await apiRequest<unknown[]>(`/tours?${query.toString()}`);
  return data.map(PublicTourListItemResponseDtoFromJSON);
}

export async function getTour(id: string): Promise<TourDetails> {
  const data = await apiRequest<unknown>(`/tours/${encodeURIComponent(id)}`);
  return PublicTourResponseDtoFromJSON(data);
}
