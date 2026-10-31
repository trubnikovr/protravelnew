import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react-native';
import type { ReferenceCountryResponseDto } from '../../../shared/api/generated/v1/models';
import { ReferenceCountryResponseDtoFromJSON } from '../../../shared/api/generated/v1/models';
import { apiRequestWithMeta } from '../../../shared/api/api-client';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
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

async function listCountries(): Promise<ReferenceCountryResponseDto[]> {
  const result = await apiRequestWithMeta<unknown[], { pagination?: { totalPages: number } }>('/reference/countries?page=1&limit=100');
  return result.data.map(ReferenceCountryResponseDtoFromJSON);
}

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
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countries = useQuery({ queryKey: ['reference', 'countries'], queryFn: listCountries });
  const selectedCountry = countries.data?.find(country => country.code === form.citizenshipCountryCode);
  const visibleCountries = (countries.data ?? []).filter(country => `${country.name} ${country.code}`.toLowerCase().includes(countrySearch.toLowerCase()));
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
            <Pressable onPress={() => setCountryMenuOpen(value => !value)} style={styles.countrySelect}>
              <View style={styles.countrySelectText}>
                <Text style={styles.countryLabel}>{t('common.citizenship')}</Text>
                <Text style={styles.countryValue}>{selectedCountry?.name ?? form.citizenshipCountryCode}</Text>
              </View>
              <ChevronDown color={theme.colors.textSecondary} size={19} />
            </Pressable>
            {countryMenuOpen ? (
              <View style={styles.countryMenu}>
                <TextInput onChangeText={setCountrySearch} placeholder={t('search.booking.searchCountry')} style={styles.countrySearch} value={countrySearch} />
                <ScrollView nestedScrollEnabled style={styles.countryList}>
                  {visibleCountries.map(country => (
                    <Pressable key={country.id} onPress={() => { update('citizenshipCountryCode', country.code); setCountryMenuOpen(false); setCountrySearch(''); }} style={styles.countryOption}>
                      <Text style={styles.countryValue}>{country.name}</Text>
                      <Text style={styles.countryCode}>{country.code}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}
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
  countrySelect: { alignItems: 'center', borderBottomColor: theme.colors.inputDivider, borderBottomWidth: 1, flexDirection: 'row', minHeight: 64, paddingHorizontal: theme.spacing.xs },
  countrySelectText: { flex: 1 },
  countryLabel: { ...typography.caption, color: theme.colors.textSecondary },
  countryValue: { ...typography.body },
  countryMenu: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.sm, maxHeight: 220, marginBottom: theme.spacing.md },
  countrySearch: { ...typography.body, borderBottomColor: theme.colors.border, borderBottomWidth: 1, padding: theme.spacing.sm },
  countryList: { maxHeight: 170 },
  countryOption: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: theme.spacing.sm },
  countryCode: { ...typography.caption, color: theme.colors.textSecondary },
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
