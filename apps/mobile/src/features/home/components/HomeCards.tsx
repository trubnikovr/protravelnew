import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { DestinationCardModel, TourCardModel } from '../model/useHome';
import { theme, typography } from '../../../shared/theme/theme';
import { TourOfferCard } from '../../../shared/ui';

export function RecommendedTourCard({
  hotel,
  onPress,
}: {
  hotel: TourCardModel;
  onPress: () => void;
}) {
  return (
    <TourOfferCard
      duration={hotel.duration}
      hotelCategory={hotel.hotelCategory}
      hot={hotel.hot}
      image={hotel.image}
      location={hotel.location}
      onPress={onPress}
      price={hotel.price?.formatted ?? ''}
      title={hotel.title}
    />
  );
}

export function DestinationCard({
  destination,
}: {
  destination: DestinationCardModel;
}) {
  return (
    <View style={styles.homeCardShadow}>
      <View style={styles.destinationCard}>
        <Image source={destination.image} style={styles.destinationImage} />
        <View style={styles.destinationOverlay} />
        <View style={styles.destinationContent}>
          <Text style={styles.destinationTitle}>{destination.title}</Text>
          <Text style={styles.destinationSubtitle}>{destination.subtitle}</Text>
          <Text style={styles.destinationPrice}>
            {destination.fromPrice?.formatted ?? ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function CategoryCard({
  title,
  image,
  onPress,
}: {
  title: string;
  image: ImageSourcePropType;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.categoryCard}>
      <View style={styles.categoryIconSlot}>
        <Image source={image} style={styles.categoryImage} />
      </View>
      <Text numberOfLines={1} style={styles.categoryTitle}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  homeCardShadow: {
    ...theme.shadows.homeCard,
    borderRadius: theme.radii.md,
    flex: 1,
  },
  destinationCard: {
    borderRadius: theme.radii.md,
    flex: 1,
    height: theme.sizes.homeCardImageHeight,
    overflow: 'hidden',
  },
  destinationImage: {
    height: '100%',
    width: '100%',
  },
  destinationOverlay: {
    backgroundColor: theme.colors.overlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  destinationContent: {
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    position: 'absolute',
  },
  destinationTitle: {
    ...typography.title,
    color: theme.colors.white,
  },
  destinationSubtitle: {
    ...typography.body,
    color: theme.colors.white,
  },
  destinationPrice: {
    ...typography.homePrice,
    color: theme.colors.white,
  },
  categoryCard: {
    ...theme.shadows.homeCard,
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    flex: 1,
    justifyContent: 'center',
  },
  categoryImage: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  categoryIconSlot: {
    height: theme.sizes.categoryIcon,
    marginBottom: theme.spacing.xxs,
    width: theme.sizes.categoryIcon,
  },
  categoryTitle: {
    ...typography.homeCategoryTitle,
  },
});
