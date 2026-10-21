import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfileStackParamList } from '../../../app/navigation/types';
import { AppTextField, PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import {
  useCustomerProfile,
  useUpdateCustomerProfile,
} from '../model/useCustomerProfile';
import { CustomerAvatar } from '../components/CustomerAvatar';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState(false);
  const profile = useCustomerProfile();
  const updateProfile = useUpdateCustomerProfile();

  useEffect(() => {
    if (!profile.data) return;
    setForm({
      firstName: profile.data.firstName,
      lastName: profile.data.lastName ?? '',
      middleName: profile.data.middleName ?? '',
      phone: profile.data.phone ?? '',
      email: profile.data.email ?? '',
    });
  }, [profile.data]);

  const update = (key: keyof typeof form, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const save = async () => {
    setError(false);
    try {
      await updateProfile.mutateAsync({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim() || null,
        email: form.email.trim() || null,
      });
      navigation.goBack();
    } catch {
      setError(true);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={navigation.goBack} title={t('profile.edit')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatar}>
            <CustomerAvatar firstName={form.firstName} phone={form.phone} />
          </View>
          <View style={styles.form}>
            <AppTextField
              label={`${t('common.lastName')} *`}
              onChangeText={value => update('lastName', value)}
              value={form.lastName}
            />
            <AppTextField
              label={t('common.firstName')}
              onChangeText={value => update('firstName', value)}
              value={form.firstName}
            />
            <AppTextField
              label={t('common.middleName')}
              onChangeText={value => update('middleName', value)}
              placeholder={t('common.middleName')}
              value={form.middleName}
            />
            <AppTextField
              keyboardType="phone-pad"
              label={t('common.phone')}
              editable={false}
              value={form.phone}
            />
            <AppTextField
              autoCapitalize="none"
              keyboardType="email-address"
              label={t('common.email')}
              onChangeText={value => update('email', value)}
              value={form.email}
            />
          </View>
          {error ? (
            <Text style={styles.error}>{t('profile.saveError')}</Text>
          ) : null}
          <PrimaryButton
            disabled={!form.firstName.trim() || !form.lastName.trim()}
            loading={updateProfile.isPending}
            onPress={save}
            title={t('common.save')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: theme.sizes.contentPadding,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  error: {
    ...typography.bodySmall,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
});
