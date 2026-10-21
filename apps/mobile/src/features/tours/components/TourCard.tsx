import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import type { TourListItem } from '../api/tours.api';
import { transformedImageUrl } from '../../home/api/home.api';
import { theme, typography } from '../../../shared/theme/theme';

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
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={tourImage(tour)} style={styles.image} />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {tour.content.title}
        </Text>
        <Text numberOfLines={2} style={styles.meta}>
          {tourLocation(tour)}
        </Text>
        <Text style={styles.meta}>
          {tour.durationDays} дн. / {tour.durationNights} ноч.
        </Text>
        <Text style={styles.price}>{tour.price.formatted}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    height: theme.sizes.homeCardImageHeight,
    resizeMode: 'cover',
    width: '100%',
  },
  content: { minHeight: 166, padding: theme.spacing.sm },
  title: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    minHeight: 42,
  },
  meta: { ...typography.bodySmall, color: theme.colors.textSecondary },
  price: {
    ...typography.titleSmall,
    color: theme.colors.text,
    marginTop: 'auto',
    paddingTop: theme.spacing.sm,
  },
});
