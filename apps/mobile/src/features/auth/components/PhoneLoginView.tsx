import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTextField, PrimaryButton } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';

type Props = {
  error: string | null;
  loading: boolean;
  onPhoneChange: (phone: string) => void;
  onSubmit: () => void;
  phone: string;
  text: {
    description: string;
    phoneLabel: string;
    phonePlaceholder: string;
    sendCode: string;
    terms: string;
  };
};

export function PhoneLoginView({
  error,
  loading,
  onPhoneChange,
  onSubmit,
  phone,
  text,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        imageStyle={styles.backgroundImage}
        source={require('../../../shared/assets/images/profile-photo-background.png')}
        style={styles.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <View style={styles.content}>
          <View style={styles.formCard}>
            <Text style={styles.description}>{text.description}</Text>
            <AppTextField
              autoComplete="tel"
              keyboardType="phone-pad"
              label={text.phoneLabel}
              maxLength={18}
              onChangeText={onPhoneChange}
              placeholder={text.phonePlaceholder}
              value={phone}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PrimaryButton
              loading={loading}
              onPress={onSubmit}
              title={text.sendCode}
            />
            <Text style={styles.terms}>{text.terms}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  background: { ...StyleSheet.absoluteFill },
  backgroundImage: { resizeMode: 'cover', opacity: 0.72 },
  keyboard: { flex: 1, justifyContent: 'center' },
  content: { padding: theme.sizes.contentPadding, width: '100%' },
  formCard: {
    ...theme.shadows.card,
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    maxWidth: 460,
    padding: theme.spacing.lg,
    width: '100%',
  },
  description: {
    ...typography.bodyLarge,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  error: {
    ...typography.bodySmall,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
  terms: {
    ...typography.footnote,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
