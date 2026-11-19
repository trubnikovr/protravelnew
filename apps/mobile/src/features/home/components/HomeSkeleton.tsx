import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';

export function HomeSkeleton() {
  const { t } = useTranslation();
  const opacity = useRef(new Animated.Value(0.48)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.48,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {(['recommended', 'destinations', 'hotTours'] as const).map(section => (
        <View key={section} style={styles.section}>
          <SectionHeader title={t(`home.${section}`)} />
          <View style={styles.row}>
            {[0, 1].map(index => (
              <View key={index} style={styles.card}>
                <Animated.View style={[styles.block, styles.cover, { opacity }]} />
                {section !== 'destinations' ? (
                  <View style={styles.content}>
                    <View style={styles.titleSlot}>
                      <Animated.View style={[styles.block, styles.title, { opacity }]} />
                    </View>
                    <Animated.View style={[styles.block, styles.meta, { opacity }]} />
                    <Animated.View style={[styles.block, styles.meta, styles.short, { opacity }]} />
                    <Animated.View style={[styles.block, styles.price, { opacity }]} />
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.sizes.contentPadding,
    width: '100%',
  },
  row: { flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'stretch' },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.tourCard,
    overflow: 'hidden',
  },
  block: { backgroundColor: theme.colors.border, borderRadius: theme.radii.sm },
  cover: { height: theme.sizes.homeCardImageHeight, width: '100%' },
  content: { padding: theme.spacing.sm },
  titleSlot: { height: 42 },
  title: { height: typography.homeCardTitle.lineHeight, width: '90%' },
  meta: { height: typography.homeCardMeta.lineHeight, width: '85%' },
  short: { width: '60%' },
  price: {
    height: typography.homePrice.lineHeight,
    marginTop: theme.spacing.sm,
    width: '70%',
  },
});
