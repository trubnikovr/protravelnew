import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme, typography } from '../theme/theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChoice({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  choice: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: theme.spacing.md,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.78,
  },
  label: {
    ...typography.bodySmall,
    color: theme.colors.textStrong,
    fontFamily: theme.fonts.medium,
    fontWeight: theme.fonts.weights.medium,
  },
  selectedLabel: {
    color: theme.colors.white,
  },
});
