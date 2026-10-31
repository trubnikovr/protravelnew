import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { theme, typography } from '../theme/theme';

export function AppSelectField({
  label,
  value,
  icon,
  code,
  compact = false,
  showChevron = false,
  showClear = false,
  rightDivider = false,
  onPress,
  onClear,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  code?: string;
  compact?: boolean;
  showChevron?: boolean;
  showClear?: boolean;
  rightDivider?: boolean;
  onPress?: () => void;
  onClear?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.field,
        compact && styles.compact,
        rightDivider && styles.rightDivider,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text numberOfLines={1} style={styles.value}>
          {value}
        </Text>
      </View>
      {code ? <Text style={styles.code}>{code}</Text> : null}
      {showClear ? (
        <Pressable
          accessibilityLabel={label}
          accessibilityRole="button"
          hitSlop={theme.spacing.sm}
          onPress={event => {
            event.stopPropagation();
            onClear?.();
          }}
        >
          <X color={theme.colors.textSecondary} size={19} />
        </Pressable>
      ) : null}
      {showChevron ? (
        <ChevronDown color={theme.colors.textSecondary} size={19} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    borderBottomColor: theme.colors.inputDivider,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 75,
    paddingHorizontal: theme.spacing.md,
  },
  compact: { flex: 1 },
  rightDivider: {
    borderRightColor: theme.colors.inputDivider,
    borderRightWidth: 1,
  },
  icon: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  text: { flex: 1 },
  label: {
    ...typography.inputPlaceholder,
    marginBottom: theme.sizes.inputLabelGap,
  },
  value: {
    ...typography.inputValue,
  },
  code: {
    ...typography.airportCode,
    marginLeft: theme.spacing.sm,
  },
});
