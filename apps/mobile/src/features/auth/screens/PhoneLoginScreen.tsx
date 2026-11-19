import { getApiErrorMessage } from '../../../shared/api/api-errors';
import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import type { AuthStackParamList } from '../../../app/navigation/types';
import { requestLoginCode } from '../api/customer-auth.api';
import { PhoneLoginView } from '../components/PhoneLoginView';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneLogin'>;

function normalizeRussianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  if (
    digits.length === 11 &&
    (digits.startsWith('7') || digits.startsWith('8'))
  ) {
    return `+7${digits.slice(1)}`;
  }
  return null;
}

export function PhoneLoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState(__DEV__ ? '+7 999 123-45-67' : '+7 ');
  const [error, setError] = useState<string | null>(null);
  const requestCode = useMutation({ mutationFn: requestLoginCode });

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
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, t('auth.sendError')));
    }
  };

  return (
    <PhoneLoginView
      error={error}
      loading={requestCode.isPending}
      onPhoneChange={setPhone}
      onSubmit={submit}
      phone={phone}
      text={{
        description: t('auth.phoneDescription'),
        phoneLabel: t('auth.phoneLabel'),
        phonePlaceholder: t('auth.phonePlaceholder'),
        sendCode: t('auth.sendCode'),
        terms: t('auth.terms'),
      }}
    />
  );
}
