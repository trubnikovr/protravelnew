import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CalendarDays, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  ProfileStackParamList,
  ToursStackParamList,
} from '../../../app/navigation/types';
import { AppTextField, PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { useCreateCustomerTraveler } from '../model/useCustomerTravelers';

type Navigation =
  | NativeStackNavigationProp<ProfileStackParamList, 'AddTraveler'>
  | NativeStackNavigationProp<ToursStackParamList, 'AddBookingTraveler'>;
type Gender = 'male' | 'female';

export function AddTravelerScreen() {
  const navigation = useNavigation<Navigation>();
  const route =
    useRoute<
      RouteProp<
        { AddBookingTraveler: { isCustomerDefault?: boolean } | undefined },
        'AddBookingTraveler'
      >
    >();
  const { t } = useTranslation();
  const [gender, setGender] = useState<Gender>('male');
  const [isCustomer, setIsCustomer] = useState(
    route.params?.isCustomerDefault ?? false,
  );
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    citizenshipCountryCode: 'UZ',
    phone: '',
    email: '',
  });
  const [error, setError] = useState(false);
  const createTraveler = useCreateCustomerTraveler();

  const update = (key: keyof typeof form, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const save = async () => {
    setError(false);
    try {
      await createTraveler.mutateAsync({
        relationship: isCustomer ? 'self' : 'other',
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim() || null,
        gender,
        birthDate: form.birthDate.trim()
          ? new Date(`${form.birthDate.trim()}T00:00:00`)
          : null,
        citizenshipCountryCode:
          form.citizenshipCountryCode.trim().toUpperCase() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
      });
      navigation.goBack();
    } catch {
      setError(true);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader
        onBack={navigation.goBack}
        title={t('profile.addTraveler')}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.genderRow}>
              <Text style={styles.genderLabel}>{t('profile.gender')}:</Text>
              {(['male', 'female'] as const).map(item => (
                <Pressable
                  key={item}
                  onPress={() => setGender(item)}
                  style={[
                    styles.genderOption,
                    gender === item && styles.genderOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === item && styles.genderTextActive,
                    ]}
                  >
                    {t(`common.${item}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <AppTextField
              label={t('common.lastName')}
              onChangeText={value => update('lastName', value)}
              placeholder={t('common.lastName')}
              value={form.lastName}
            />
            <AppTextField
              label={t('common.firstName')}
              onChangeText={value => update('firstName', value)}
              placeholder={t('common.firstName')}
              value={form.firstName}
            />
            <AppTextField
              label={t('common.middleName')}
              onChangeText={value => update('middleName', value)}
              placeholder={t('common.middleName')}
              value={form.middleName}
            />
            <AppTextField
              label={t('common.birthDate')}
              onChangeText={value => update('birthDate', value)}
              placeholder="ГГГГ-ММ-ДД"
              trailing={<CalendarDays color={theme.colors.primary} size={19} />}
              value={form.birthDate}
            />
            <AppTextField
              label={t('common.citizenship')}
              maxLength={2}
              onChangeText={value => update('citizenshipCountryCode', value)}
              placeholder="UZ"
              value={form.citizenshipCountryCode}
            />
            <AppTextField
              keyboardType="phone-pad"
              label={t('common.phone')}
              onChangeText={value => update('phone', value)}
              placeholder={t('common.phone')}
              value={form.phone}
            />
            <AppTextField
              autoCapitalize="none"
              keyboardType="email-address"
              label={t('common.email')}
              onChangeText={value => update('email', value)}
              placeholder={t('common.email')}
              value={form.email}
            />
            <Pressable
              onPress={() => setIsCustomer(value => !value)}
              style={styles.checkboxRow}
            >
              <View
                style={[styles.checkbox, isCustomer && styles.checkboxChecked]}
              >
                {isCustomer ? (
                  <Check color={theme.colors.white} size={15} />
                ) : null}
              </View>
              <Text style={styles.checkboxLabel}>
                {t('profile.missingForCustomer')}
              </Text>
            </Pressable>
          </View>
          {error ? (
            <Text style={styles.error}>{t('profile.travelerSaveError')}</Text>
          ) : null}
          <PrimaryButton
            disabled={!form.firstName.trim() || !form.lastName.trim()}
            loading={createTraveler.isPending}
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
  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  genderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  genderLabel: {
    ...typography.bodySemibold,
    marginRight: theme.spacing.sm,
  },
  genderOption: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  genderOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  genderText: {
    ...typography.bodySmall,
    color: theme.colors.primary,
  },
  genderTextActive: {
    color: theme.colors.white,
  },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxLabel: {
    ...typography.bodySmall,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  error: {
    ...typography.bodySmall,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
});
