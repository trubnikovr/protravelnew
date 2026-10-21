import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {theme, typography} from '../theme/theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: Props) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    height: theme.sizes.buttonHeight,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  label: {
    ...typography.bodySemibold,
    color: theme.colors.white,
  },
  pressed: {
    backgroundColor: theme.colors.primaryDark,
  },
  disabled: {
    backgroundColor: theme.colors.textMuted,
  },
});
