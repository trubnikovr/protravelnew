import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { Flame, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { scaleFontSize, theme, typography } from '../theme/theme';

export function TourOfferCard({
  image,
  title,
  location,
  duration,
  price,
  hotelCategory,
  hot = false,
  onPress,
}: {
  image: ImageSourcePropType;
  title: string;
  location: string;
  duration: string;
  price: string;
  hotelCategory?: number | null;
  hot?: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const hasHotelCategory =
    typeof hotelCategory === 'number' &&
    Number.isFinite(hotelCategory) &&
    hotelCategory > 0;
  const hasBadges = hasHotelCategory || hot;

  return (
    <View style={styles.cardShadow}>
      <Pressable onPress={onPress} style={styles.card}>
        <View>
          <Image source={image} style={styles.image} />
          {hasBadges ? (
            <View style={styles.badgeRow}>
              {hasHotelCategory ? (
                <View style={styles.badge}>
                  <Star
                    color={theme.colors.warning}
                    fill={theme.colors.warning}
                    size={12}
                    strokeWidth={1.5}
                  />
                  <Text style={styles.badgeText}>{hotelCategory}</Text>
                </View>
              ) : null}
              {hot ? (
                <View style={styles.badge}>
                  <Flame
                    color={theme.colors.danger}
                    fill={theme.colors.danger}
                    size={11}
                  />
                  <Text style={styles.hotText}>{t('home.hot')}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={2} style={styles.meta}>
            {location}
          </Text>
          <Text style={styles.meta}>{duration}</Text>
          {price ? <Text style={styles.price}>{price}</Text> : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    ...theme.shadows.homeCard,
    borderRadius: theme.radii.tourCard,
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.tourCard,
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    height: theme.sizes.homeCardImageHeight,
    resizeMode: 'cover',
    width: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    left: theme.spacing.xs,
    position: 'absolute',
    top: theme.spacing.xs,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    flexDirection: 'row',
    height: 20,
    paddingHorizontal: 7,
  },
  badgeText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: scaleFontSize(12),
    fontWeight: theme.fonts.weights.regular,
    includeFontPadding: false,
    lineHeight: scaleFontSize(14),
    marginLeft: theme.spacing.xxs,
    textAlignVertical: 'center',
  },
  hotText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: scaleFontSize(11),
    fontWeight: theme.fonts.weights.regular,
    includeFontPadding: false,
    lineHeight: scaleFontSize(13),
    marginLeft: 3,
    textAlignVertical: 'center',
  },
  content: {
    padding: theme.spacing.sm,
  },
  title: {
    ...typography.homeCardTitle,
    minHeight: 42,
  },
  meta: {
    ...typography.homeCardMeta,
  },
  price: {
    ...typography.homePrice,
    paddingTop: theme.spacing.sm,
  },
});
