import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useMutation} from '@tanstack/react-query';
import type {AuthStackParamList} from '../../../app/navigation/types';
import {AppTextField, PrimaryButton} from '../../../shared/ui';
import {theme, typography} from '../../../shared/theme/theme';
import {verifyLoginCode} from '../api/customer-auth.api';
import {useAuthSession} from '../model/AuthSessionContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyCode'>;

export function VerifyCodeScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const {signIn} = useAuthSession();
  const {phone, verificationId, developmentCode} = route.params;
  const [code, setCode] = useState(developmentCode ?? '');
  const [error, setError] = useState<string | null>(null);
  const verifyCode = useMutation({
    mutationFn: (otp: string) => verifyLoginCode(verificationId, otp),
  });

  const changeCode = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 4));
  };

  const submit = async () => {
    if (!/^\d{4}$/.test(code)) {
      setError(t('auth.codeValidation'));
      return;
    }
    setError(null);
    try {
      const session = await verifyCode.mutateAsync(code);
      signIn(session, phone);
    } catch {
      setError(t('auth.verifyError'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <View style={styles.content}>
          <Text onPress={navigation.goBack} style={styles.back}>
            {t('auth.back')}
          </Text>
          <Text style={styles.title}>{t('auth.verifyTitle')}</Text>
          <Text style={styles.description}>
            {t('auth.codeSent', {phone})}
          </Text>
          {developmentCode ? (
            <View style={styles.mockCard}>
              <Text style={styles.mockLabel}>{t('auth.mockCode')}</Text>
              <Text style={styles.mockCode}>{developmentCode}</Text>
            </View>
          ) : null}
          <AppTextField
            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
            keyboardType="number-pad"
            label={t('auth.codeLabel')}
            onChangeText={changeCode}
            placeholder="0000"
            textContentType="oneTimeCode"
            value={code}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            loading={verifyCode.isPending}
            onPress={submit}
            title={t('auth.signIn')}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: theme.colors.background, flex: 1},
  keyboard: {flex: 1, justifyContent: 'center'},
  content: {padding: theme.sizes.contentPadding},
  back: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
  },
  title: {...typography.heading, marginBottom: theme.spacing.sm},
  description: {
    ...typography.bodyLarge,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  mockCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  mockLabel: {...typography.bodySmall, color: theme.colors.primaryDark},
  mockCode: {
    ...typography.title,
    color: theme.colors.primaryDark,
    letterSpacing: 5,
    marginTop: theme.spacing.xxs,
  },
  error: {
    ...typography.bodySmall,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
});
