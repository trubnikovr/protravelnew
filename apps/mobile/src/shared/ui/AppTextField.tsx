import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { theme, typography } from '../theme/theme';

type Props = TextInputProps & {
  label: string;
  trailing?: React.ReactNode;
};

export function AppTextField({ label, trailing, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholderTextColor={theme.colors.inputPlaceholder}
          style={[styles.input, style]}
          {...props}
        />
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    minHeight: theme.sizes.inputHeight,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  label: {
    ...typography.inputPlaceholder,
    marginBottom: theme.sizes.inputLabelGap,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    ...typography.inputValue,
    flex: 1,
    margin: 0,
    minHeight: 34,
    padding: 0,
    textAlignVertical: 'center',
  },
});
