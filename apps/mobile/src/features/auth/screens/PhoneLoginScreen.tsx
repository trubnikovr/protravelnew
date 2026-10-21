import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useMutation} from '@tanstack/react-query';
import type {AuthStackParamList} from '../../../app/navigation/types';
import {AppTextField, PrimaryButton} from '../../../shared/ui';
import {theme, typography} from '../../../shared/theme/theme';
import {requestLoginCode} from '../api/customer-auth.api';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneLogin'>;

function normalizeRussianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return `+7${digits.slice(1)}`;
  }
  return null;
}

export function PhoneLoginScreen({navigation}: Props) {
  const {t} = useTranslation();
  const [phone, setPhone] = useState(
    __DEV__ ? '+7 999 123-45-67' : '+7 ',
  );
  const [error, setError] = useState<string | null>(null);
  const requestCode = useMutation({mutationFn: requestLoginCode});

  const submit = async () => {
    const normalizedPhone = normalizeRussianPhone(phone);
    if (!normalizedPhone) {
      setError(t('auth.phoneValidation'));
      return;
    }
    setError(null);
    try {
      const challenge = await requestCode.mutateAsync(normalizedPhone);
      navigation.navigate('VerifyCode', {
        phone: normalizedPhone,
        ...challenge,
      });
    } catch {
      setError(t('auth.sendError'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('auth.title')}</Text>
          <Text style={styles.description}>
            {t('auth.phoneDescription')}
          </Text>
          <AppTextField
            autoComplete="tel"
            keyboardType="phone-pad"
            label={t('auth.phoneLabel')}
            maxLength={18}
            onChangeText={setPhone}
            placeholder={t('auth.phonePlaceholder')}
            value={phone}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            loading={requestCode.isPending}
            onPress={submit}
            title={t('auth.sendCode')}
          />
          <Text style={styles.terms}>
            {t('auth.terms')}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: theme.colors.background, flex: 1},
  keyboard: {flex: 1, justifyContent: 'center'},
  content: {padding: theme.sizes.contentPadding},
  title: {...typography.heading, marginBottom: theme.spacing.sm},
  description: {
    ...typography.bodyLarge,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
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
