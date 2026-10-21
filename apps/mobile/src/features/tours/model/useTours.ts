import { useQuery } from '@tanstack/react-query';
import { getTour, getTours, type TourListFilters } from '../api/tours.api';

export const tourKeys = {
  all: ['tours'] as const,
  list: (filters: TourListFilters) => ['tours', 'list', filters] as const,
  detail: (id: string) => ['tours', 'detail', id] as const,
};

export function useTours(filters: TourListFilters) {
  return useQuery({
    queryKey: tourKeys.list(filters),
    queryFn: () => getTours(filters),
  });
}

export function useTour(id: string) {
  return useQuery({
    queryKey: tourKeys.detail(id),
    queryFn: () => getTour(id),
  });
}
