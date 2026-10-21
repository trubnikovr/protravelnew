import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowLeft} from 'lucide-react-native';
import {theme, typography} from '../theme/theme';

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
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
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
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
    flex: 1,
    textAlign: 'center',
  },
});
