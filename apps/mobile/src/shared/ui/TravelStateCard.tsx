import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TravelStateIcon } from './TravelStateIcon';
import { theme, typography } from '../theme/theme';

export function TravelStateCard({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.stateCard}>
      <TravelStateIcon />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={styles.retryButton}>
          <Text style={styles.retry}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stateText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  stateCard: {
    ...theme.shadows.card,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    maxWidth: 420,
    padding: theme.spacing.xl,
    width: '100%',
  },
  stateTitle: {
    ...typography.titleSmall,
    color: theme.colors.textStrong,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  retry: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
});
