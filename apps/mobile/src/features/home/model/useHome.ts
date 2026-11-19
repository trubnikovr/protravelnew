import {useCallback, useMemo} from 'react';
import type { ImageSourcePropType } from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {
  getHomeContent,
  transformedImageUrl,
  type HomeDestination,
  type HomeTour,
} from '../api/home.api';

export type TourCardModel = HomeTour & {
  image: ImageSourcePropType;
  hot?: boolean;
};

export type DestinationCardModel = HomeDestination & {
  image: ImageSourcePropType;
};

type HomeState = {
  recommended: TourCardModel[];
  popularDestinations: DestinationCardModel[];
  hotTours: TourCardModel[];
  loading: boolean;
  error: boolean;
  errorCause: unknown;
  refresh: () => Promise<void>;
};

export const homeQueryKey = ['home'] as const;
const tourFallbacks = [
  require('../../../shared/assets/images/hotel-otium.png'),
  require('../../../shared/assets/images/hotel-colosseum.png'),
];
const destinationFallbacks = [
  require('../../../shared/assets/images/destination-uae.png'),
  require('../../../shared/assets/images/destination-qatar.png'),
];

function image(
  imageUrl: string | null,
  fallback: ImageSourcePropType,
): ImageSourcePropType {
  return imageUrl ? { uri: transformedImageUrl(imageUrl) } : fallback;
}

function mapTours(items: HomeTour[], hot = false): TourCardModel[] {
  return items.map((item, index) => ({
    ...item,
    image: image(item.imageUrl, tourFallbacks[index % 2]),
    hot,
  }));
}

function mapDestinations(items: HomeDestination[]): DestinationCardModel[] {
  return items.map((item, index) => ({
    ...item,
    image: image(item.imageUrl, destinationFallbacks[index % 2]),
  }));
}

export function useHome(): HomeState {
  const {data, error, isError, isPending, refetch} = useQuery({
    queryKey: homeQueryKey,
    queryFn: getHomeContent,
  });
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return useMemo<HomeState>(
    () => ({
      recommended: mapTours(data?.recommended ?? []),
      popularDestinations: mapDestinations(
        data?.popularDestinations ?? [],
      ),
      hotTours: mapTours(data?.hotTours ?? [], true),
      loading: isPending,
      error: isError && !data,
      errorCause: error,
      refresh,
    }),
    [data, error, isError, isPending, refresh],
  );
}
