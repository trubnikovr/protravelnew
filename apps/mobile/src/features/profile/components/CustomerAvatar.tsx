import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme, typography } from '../../../shared/theme/theme';

type Props = {
  firstName?: string | null;
  phone?: string | null;
  size?: 'compact' | 'large';
};

const LEGACY_PLACEHOLDER_NAME = 'путешественник';

export function CustomerAvatar({ firstName, phone, size = 'large' }: Props) {
  const normalizedName = firstName?.trim();
  const hasRealName =
    normalizedName &&
    normalizedName.toLocaleLowerCase('ru-RU') !== LEGACY_PLACEHOLDER_NAME;
  const phoneDigits = phone?.replace(/\D/g, '') ?? '';
  const label = hasRealName
    ? Array.from(normalizedName)[0]?.toLocaleUpperCase('ru-RU')
    : phoneDigits.slice(-2) || '?';
  const compact = size === 'compact';

  return (
    <View
      accessibilityLabel={label}
      style={[styles.avatar, compact ? styles.compact : styles.large]}
    >
      <Text style={compact ? styles.compactText : styles.largeText}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    justifyContent: 'center',
  },
  compact: {
    height: theme.sizes.customerAvatarCompact,
    width: theme.sizes.customerAvatarCompact,
  },
  large: {
    borderWidth: 4,
    height: theme.sizes.customerAvatarLarge,
    width: theme.sizes.customerAvatarLarge,
  },
  compactText: {
    ...typography.titleSmall,
    color: theme.colors.primaryDark,
  },
  largeText: {
    ...typography.display,
    color: theme.colors.primaryDark,
  },
});
