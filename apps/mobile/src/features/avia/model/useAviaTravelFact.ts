import { useQuery } from '@tanstack/react-query';
import { getTravelFacts } from '../api/avia-travel-facts.api';

export function useTravelFacts(destinationCode: string) {
  return useQuery({
    queryKey: ['travel-facts', destinationCode],
    queryFn: ({ signal }) => getTravelFacts(destinationCode, signal),
    gcTime: 0,
    staleTime: 0,
  });
}
