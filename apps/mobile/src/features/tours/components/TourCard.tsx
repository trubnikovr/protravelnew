import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { TourListItem } from '../api/tours.api';
import { transformedImageUrl } from '../../home/api/home.api';
import { TourOfferCard } from '../../../shared/ui';

const fallback = require('../../../shared/assets/images/hotel-otium.png');

export function tourLocation(tour: TourListItem): string {
  return tour.destinations
    .map(item => [item.countryName, item.cityName].filter(Boolean).join(', '))
    .join(' · ');
}

function tourImage(tour: TourListItem): ImageSourcePropType {
  return tour.coverImage?.url
    ? { uri: transformedImageUrl(tour.coverImage.url) }
    : fallback;
}

export function TourCard({
  tour,
  onPress,
}: {
  tour: TourListItem;
  onPress: () => void;
}) {
  return (
    <TourOfferCard
      duration={`${tour.durationDays} дн. / ${tour.durationNights} ноч.`}
      image={tourImage(tour)}
      location={tourLocation(tour)}
      onPress={onPress}
      price={tour.price?.formatted ?? ''}
      title={tour.content.title}
    />
  );
}
