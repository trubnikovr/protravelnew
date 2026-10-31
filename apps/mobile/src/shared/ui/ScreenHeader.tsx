import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { theme, typography } from '../theme/theme';

export function ScreenHeader({
  title,
  titleSuffix,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  titleSuffix?: React.ReactNode;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable hitSlop={theme.spacing.md} onPress={onBack}>
            <ArrowLeft color={theme.colors.textStrong} size={23} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.titleGroup}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {titleSuffix}
        </View>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    height: theme.sizes.headerHeight,
    paddingHorizontal: theme.sizes.contentPadding,
  },
  side: {
    width: 36,
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    ...typography.bodySemibold,
    flexShrink: 1,
    textAlign: 'center',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleGroup: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
