import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useConnectionUnavailable } from '../api/connection-state';
import { theme, typography } from '../theme/theme';

export function ConnectionBanner() {
  const unavailable = useConnectionUnavailable();
  const { t } = useTranslation();
  const client = useQueryClient();
  const insets = useSafeAreaInsets();
  const [retrying, setRetrying] = useState(false);

  if (!unavailable) return null;

  const retry = async () => {
    setRetrying(true);
    try {
      await client.refetchQueries({ type: 'active' });
    } finally {
      setRetrying(false);
    }
  };

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.banner, {
        paddingLeft: Math.max(insets.left, theme.spacing.md),
        paddingRight: Math.max(insets.right, theme.spacing.md),
      }]}
    >
      <Text style={styles.message}>{t('common.connectionUnavailable')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: retrying, busy: retrying }}
        disabled={retrying}
        onPress={retry}
        style={styles.action}
      >
        <Text style={styles.actionText}>{t('common.retry')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: theme.colors.textStrong,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  message: { ...typography.caption, color: theme.colors.surface, flex: 1 },
  action: { padding: theme.spacing.sm },
  actionText: { ...typography.caption, color: theme.colors.surface },
});
