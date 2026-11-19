import { useMutation, useQuery } from '@tanstack/react-query';
import type { FeaturedFlightLocationResponseDto } from '../../../shared/api/generated/v1/models';
import { getAviaPopularPlaces } from '../api/avia.api';
import type { Place } from './aviaSearchForm';

export function useAviaPopularPlaces() {
  const places = useQuery({
    queryKey: ['avia-popular-places'],
    queryFn: getAviaPopularPlaces,
  });
  const selection = useMutation({
    mutationFn: async (place: FeaturedFlightLocationResponseDto): Promise<Place> => ({
      code: place.airportCodes[0] ?? place.cityId,
      label: place.name,
      airportCodes: place.airportCodes,
    }),
  });
  return { places, selection };
}
