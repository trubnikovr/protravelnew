import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppTextField, PrimaryButton } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { requestLoginCode, verifyLoginCode } from '../api/customer-auth.api';
import { useAuthSession } from '../model/AuthSessionContext';

type Challenge = {
  phone: string;
  verificationId: string;
  developmentCode?: string;
};

export function BookingAuthModal({
  visible,
  onClose,
  onAuthenticated,
}: {
  visible: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}) {
  const { t } = useTranslation();
  const { signIn } = useAuthSession();
  const [phone, setPhone] = useState(__DEV__ ? '+7 999 123-45-67' : '+7 ');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const requestCode = useMutation({ mutationFn: requestLoginCode });
  const verifyCode = useMutation({
    mutationFn: (input: { verificationId: string; code: string }) =>
      verifyLoginCode(input.verificationId, input.code),
  });

  useEffect(() => {
    if (!visible) {
      setChallenge(null);
      setCode('');
      setError(null);
    }
  }, [visible]);

  const send = async () => {
    const normalized = normalizeRussianPhone(phone);
    if (!normalized) return setError(t('auth.phoneValidation'));
    setError(null);
    try {
      const result = await requestCode.mutateAsync(normalized);
      setChallenge({ phone: normalized, ...result });
      setCode(result.developmentCode ?? '');
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, t('auth.sendError')));
    }
  };

  const verify = async () => {
    if (!challenge || !/^\d{4}$/.test(code)) {
      setError(t('auth.codeValidation'));
      return;
    }
    setError(null);
    try {
      const session = await verifyCode.mutateAsync({
        verificationId: challenge.verificationId,
        code,
      });
      signIn(session, challenge.phone);
      onAuthenticated();
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, t('auth.verifyError')));
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('bookingAuth.title')}</Text>
            <Pressable hitSlop={theme.spacing.md} onPress={onClose}>
              <X color={theme.colors.text} size={22} />
            </Pressable>
          </View>
          <Text style={styles.description}>
            {challenge
              ? t('auth.codeSent', { phone: challenge.phone })
              : t('bookingAuth.description')}
          </Text>
          {challenge ? (
            <>
              {challenge.developmentCode ? (
                <Text style={styles.mockCode}>
                  {t('auth.mockCode')}: {challenge.developmentCode}
                </Text>
              ) : null}
              <AppTextField
                autoComplete={
                  Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'
                }
                keyboardType="number-pad"
                label={t('auth.codeLabel')}
                onChangeText={value =>
                  setCode(value.replace(/\D/g, '').slice(0, 4))
                }
                placeholder="0000"
                textContentType="oneTimeCode"
                value={code}
              />
            </>
          ) : (
            <AppTextField
              autoComplete="tel"
              keyboardType="phone-pad"
              label={t('auth.phoneLabel')}
              maxLength={18}
              onChangeText={setPhone}
              placeholder={t('auth.phonePlaceholder')}
              value={phone}
            />
          )}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            loading={requestCode.isPending || verifyCode.isPending}
            onPress={challenge ? verify : send}
            title={challenge ? t('auth.signIn') : t('auth.sendCode')}
          />
          {challenge ? (
            <Text onPress={() => setChallenge(null)} style={styles.changePhone}>
              {t('bookingAuth.changePhone')}
            </Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function normalizeRussianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return `+7${digits}`;
  if (digits.length === 11 && /^[78]/.test(digits)) {
    return `+7${digits.slice(1)}`;
  }
  return null;
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    padding: theme.sizes.contentPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { ...typography.title },
  description: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  mockCode: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  error: {
    ...typography.bodySmall,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
  changePhone: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
