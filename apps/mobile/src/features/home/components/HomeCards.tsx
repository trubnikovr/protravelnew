import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Flame } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { DestinationCardModel, TourCardModel } from '../model/useHome';
import { theme, typography } from '../../../shared/theme/theme';

export function HotelCard({
  hotel,
  onPress,
}: {
  hotel: TourCardModel;
  onPress?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.hotelCard}>
      <View>
        <Image source={hotel.image} style={styles.hotelImage} />
        {hotel.hot ? (
          <View style={styles.hotBadge}>
            <Flame
              color={theme.colors.danger}
              fill={theme.colors.danger}
              size={13}
            />
            <Text style={styles.hotText}>{t('home.hot')}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.hotelContent}>
        <Text numberOfLines={2} style={styles.hotelTitle}>
          {hotel.title}
        </Text>
        <Text style={styles.hotelMeta}>{hotel.location}</Text>
        <Text style={styles.hotelMeta}>{hotel.duration}</Text>
        <View style={styles.priceBlock}>
          <Text style={styles.price}>{hotel.price.formatted}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function DestinationCard({
  destination,
}: {
  destination: DestinationCardModel;
}) {
  return (
    <View style={styles.destinationCard}>
      <Image source={destination.image} style={styles.destinationImage} />
      <View style={styles.destinationOverlay} />
      <View style={styles.destinationContent}>
        <Text style={styles.destinationTitle}>{destination.title}</Text>
        <Text style={styles.destinationSubtitle}>{destination.subtitle}</Text>
        <Text style={styles.destinationPrice}>
          {destination.fromPrice.formatted}
        </Text>
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
      <Image source={image} style={styles.categoryImage} />
      <Text numberOfLines={1} style={styles.categoryTitle}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hotelCard: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    flex: 1,
    overflow: 'hidden',
  },
  hotelImage: {
    height: theme.sizes.homeCardImageHeight,
    resizeMode: 'cover',
    width: '100%',
  },
  hotelContent: {
    minHeight: 166,
    padding: theme.spacing.sm,
  },
  hotelTitle: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    minHeight: 42,
  },
  hotelMeta: {
    ...typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  priceBlock: {
    marginTop: 'auto',
    paddingTop: theme.spacing.sm,
  },
  oldPrice: {
    ...typography.bodySmall,
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  price: {
    ...typography.titleSmall,
    color: theme.colors.text,
  },
  rating: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    flexDirection: 'row',
    left: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    position: 'absolute',
    top: theme.spacing.xs,
  },
  ratingText: {
    ...typography.bodySemibold,
    marginLeft: theme.spacing.xxs,
  },
  hotBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    flexDirection: 'row',
    left: 62,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    position: 'absolute',
    top: theme.spacing.xs,
  },
  hotText: {
    ...typography.caption,
    color: theme.colors.text,
    marginLeft: theme.spacing.xxs,
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
    ...typography.bodySemibold,
    color: theme.colors.white,
  },
  categoryCard: {
    ...theme.shadows.card,
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    flex: 1,
    justifyContent: 'center',
  },
  categoryImage: {
    height: theme.sizes.categoryIcon,
    marginBottom: theme.spacing.xs,
    width: theme.sizes.categoryIcon,
  },
  categoryTitle: {
    ...typography.caption,
    color: theme.colors.text,
  },
});
