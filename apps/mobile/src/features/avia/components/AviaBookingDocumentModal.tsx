import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, ChevronDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  CreateTravelerDocumentRequestDto,
  ReferenceCountryResponseDto,
  TravelerResponseDto,
} from '../../../shared/api/generated/v1/models';
import { ReferenceCountryResponseDtoFromJSON } from '../../../shared/api/generated/v1/models';
import { apiRequestWithMeta } from '../../../shared/api/api-client';
import { AppTextField, PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import {
  createCustomerTraveler,
  createCustomerTravelerDocument,
} from '../../profile/api/travelers.api';
import { customerTravelersQueryKey } from '../../profile/model/useCustomerTravelers';
import passportMock from '../data/passport.mock.json';

type Props = {
  visible: boolean;
  travelers: TravelerResponseDto[];
  onClose: () => void;
  onSaved: () => void;
};

type DocumentType = 'national_passport' | 'international_passport';
type Gender = 'male' | 'female';

function initialPassportForm() {
  return __DEV__ ? { ...passportMock } : {
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    citizenship: 'UZ',
    number: '',
    issuingCountry: 'UZ',
    expiresAt: '',
    phone: '',
    email: '',
  };
}

export function AviaBookingDocumentModal({
  visible,
  travelers,
  onClose,
  onSaved,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [documentType, setDocumentType] =
    useState<DocumentType>('international_passport');
  const [gender, setGender] = useState<Gender>('male');
  const [form, setForm] = useState(initialPassportForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [documentTypeExpanded, setDocumentTypeExpanded] = useState(false);
  const [citizenshipExpanded, setCitizenshipExpanded] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countries = useQuery({
    enabled: visible,
    queryKey: ['reference', 'countries'],
    queryFn: ({ signal }) => listCountries(signal),
  });
  const hasSelf = useMemo(
    () => travelers.some(traveler => traveler.relationship === 'self'),
    [travelers],
  );
  const selectedCitizenship = countries.data?.find(country => country.code === form.citizenship);
  const filteredCountries = (countries.data ?? []).filter(country =>
    `${country.name} ${country.code}`.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  useEffect(() => {
    if (!visible) return;
    setError(null);
    setDocumentType('international_passport');
    setGender('male');
    setForm(initialPassportForm());
    setDocumentTypeExpanded(false);
    setCitizenshipExpanded(false);
    setCountrySearch('');
  }, [visible]);

  const update = (key: keyof typeof form, value: string) =>
    setForm(current => ({ ...current, [key]: value }));

  const save = async () => {
    setError(null);
    setSaving(true);
    let createdTravelerId: string | null = null;
    try {
      if (
        !/^[A-Za-z][A-Za-z '-]*$/.test(form.firstName.trim()) ||
        !/^[A-Za-z][A-Za-z '-]*$/.test(form.lastName.trim())
      ) {
        setError(t('search.booking.latinNameError'));
        return;
      }
      if (
        !form.number.trim() ||
        !/^[A-Za-z]{2}$/.test(form.issuingCountry.trim()) ||
        (form.expiresAt.trim() && !parseDateInput(form.expiresAt))
      ) {
        setError(t('search.booking.saveError'));
        return;
      }
      if (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !parseDateInput(form.birthDate) ||
        !/^[A-Za-z]{2}$/.test(form.citizenship.trim())
      ) {
        setError(t('search.booking.saveError'));
        return;
      }
      const owner = await createCustomerTraveler({
        relationship: hasSelf ? 'other' : 'self',
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim() || null,
        gender,
        birthDate: parseDateInput(form.birthDate),
        citizenshipCountryCode: form.citizenship.trim().toUpperCase(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
      });
      createdTravelerId = owner.id;

      const document: CreateTravelerDocumentRequestDto = {
        type: documentType,
        number: form.number.trim(),
        issuingCountryCode: form.issuingCountry.trim().toUpperCase(),
        expiresAt: form.expiresAt.trim()
          ? parseDateInput(form.expiresAt)
          : null,
        firstNameLatin: form.firstName.trim().toUpperCase(),
        lastNameLatin: form.lastName.trim().toUpperCase(),
      };
      await createCustomerTravelerDocument(owner.id, document);
      await queryClient.invalidateQueries({ queryKey: customerTravelersQueryKey });
      onSaved();
    } catch (caughtError) {
      if (createdTravelerId) {
        await queryClient.invalidateQueries({
          queryKey: customerTravelersQueryKey,
        });
      }
      setError(getApiErrorMessage(caughtError, t('search.booking.saveError')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
      visible={visible}
    >
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <ScreenHeader
          onBack={onClose}
          title={t('search.booking.passengerData')}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.subtitle}>{t('search.booking.passengerDataHint')}</Text>
            <View style={styles.genderRow}>
              <Text style={styles.genderLabel}>{t('search.booking.gender')}:</Text>
              {(['male', 'female'] as const).map(value => (
                <Pressable
                  key={value}
                  onPress={() => setGender(value)}
                  style={[
                    styles.genderChoice,
                    gender === value && styles.genderChoiceActive,
                  ]}
                >
                  <Text style={[styles.choiceText, gender === value && styles.genderChoiceTextActive]}>
                    {t(`search.booking.${value}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.formCard}>
              <AppTextField
                autoCapitalize="characters"
                label={t('search.booking.lastNameLatin')}
                onChangeText={value => update('lastName', value)}
                value={form.lastName}
              />
              <AppTextField
                autoCapitalize="characters"
                label={t('search.booking.firstNameLatin')}
                onChangeText={value => update('firstName', value)}
                value={form.firstName}
              />
              <AppTextField
                label={t('common.middleName')}
                onChangeText={value => update('middleName', value)}
                value={form.middleName}
              />
              <AppTextField
                label={t('search.booking.birthDate')}
                onChangeText={value => update('birthDate', value)}
                placeholder="01.01.1990"
                trailing={<CalendarDays color={theme.colors.primary} size={19} />}
                value={form.birthDate}
              />
              {countries.isError ? (
                <AppTextField
                  label={t('search.booking.citizenship')}
                  maxLength={2}
                  onChangeText={value => update('citizenship', value)}
                  placeholder="UZ"
                  value={form.citizenship}
                />
              ) : (
                <Pressable onPress={() => setCitizenshipExpanded(value => !value)} style={styles.selectField}>
                  <View style={styles.selectText}>
                    <Text style={styles.selectLabel}>{t('search.booking.citizenship')}</Text>
                    <Text style={styles.selectValue}>{selectedCitizenship?.name ?? form.citizenship}</Text>
                  </View>
                  <ChevronDown color={theme.colors.textSecondary} size={19} />
                </Pressable>
              )}
              {citizenshipExpanded && !countries.isError ? (
                <View style={styles.countryMenu}>
                  <TextInput
                    onChangeText={setCountrySearch}
                    placeholder={t('search.booking.searchCountry')}
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    style={styles.countrySearch}
                    value={countrySearch}
                  />
                  <ScrollView nestedScrollEnabled style={styles.countryList}>
                    {filteredCountries.map(country => (
                      <Pressable
                        key={country.id}
                        onPress={() => {
                          update('citizenship', country.code);
                          setCitizenshipExpanded(false);
                          setCountrySearch('');
                        }}
                        style={styles.countryOption}
                      >
                        <Text style={styles.choiceText}>{country.name}</Text>
                        <Text style={styles.countryCode}>{country.code}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>

            <Text style={styles.label}>{t('search.booking.documentDetails')}</Text>
            <View style={styles.formCard}>
              <Pressable onPress={() => setDocumentTypeExpanded(value => !value)} style={styles.selectField}>
                <View style={styles.selectText}>
                  <Text style={styles.selectLabel}>{t('search.booking.documentType')}</Text>
                  <Text style={styles.selectValue}>{t(documentType === 'national_passport' ? 'search.booking.nationalPassport' : 'search.booking.internationalPassport')}</Text>
                </View>
                <ChevronDown color={theme.colors.textSecondary} size={19} />
              </Pressable>
              {documentTypeExpanded ? (
                <View style={styles.documentTypeChoices}>
                  {([
                    ['national_passport', 'search.booking.nationalPassport'],
                    ['international_passport', 'search.booking.internationalPassport'],
                  ] as const).map(([value, label]) => (
                    <Pressable key={value} onPress={() => { setDocumentType(value); setDocumentTypeExpanded(false); }} style={styles.documentTypeChoice}>
                      <Text style={styles.choiceText}>{t(label)}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              <AppTextField
                autoCapitalize="characters"
                label={t('search.booking.documentNumber')}
                onChangeText={value => update('number', value)}
                placeholder={t('search.booking.documentNumber')}
                value={form.number}
              />
              <AppTextField
                autoCapitalize="characters"
                label={t('search.booking.issuingCountry')}
                maxLength={2}
                onChangeText={value => update('issuingCountry', value)}
                placeholder="UZ"
                value={form.issuingCountry}
              />
              <AppTextField
                label={t('search.booking.expiresAt')}
                onChangeText={value => update('expiresAt', value)}
                placeholder="01.01.2030"
                trailing={<CalendarDays color={theme.colors.primary} size={19} />}
                value={form.expiresAt}
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
            </View>
            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}
            <PrimaryButton
              loading={saving}
              onPress={save}
              title={t('common.save')}
            />
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.secondaryText}>{t('common.cancel')}</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

async function listCountries(signal?: AbortSignal): Promise<ReferenceCountryResponseDto[]> {
  const allCountries: ReferenceCountryResponseDto[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const response = await apiRequestWithMeta<unknown[], { pagination?: { totalPages: number } }>(
      `/reference/countries?page=${page}&limit=100`,
      { signal },
    );
    allCountries.push(...response.data.map(ReferenceCountryResponseDtoFromJSON));
    totalPages = response.meta?.pagination?.totalPages ?? page;
    page += 1;
  } while (page <= totalPages);
  return allCountries;
}

function parseDateInput(value: string): Date | null {
  const trimmed = value.trim();
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(trimmed);
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  const day = match ? Number(match[1]) : Number(isoMatch?.[3]);
  const month = match ? Number(match[2]) : Number(isoMatch?.[2]);
  const year = match ? Number(match[3]) : Number(isoMatch?.[1]);
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return null;
  return date;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  flex: { flex: 1 },
  content: { padding: theme.sizes.contentPadding, paddingBottom: theme.spacing.xxl },
  subtitle: { ...typography.bodySmall, marginBottom: theme.spacing.md },
  label: { ...typography.bodySemibold, marginBottom: theme.spacing.sm },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  genderRow: { alignItems: 'center', flexDirection: 'row', marginBottom: theme.spacing.md },
  genderLabel: { ...typography.bodySemibold, marginRight: theme.spacing.sm },
  genderChoice: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  genderChoiceActive: { backgroundColor: theme.colors.primary },
  genderChoiceTextActive: { color: theme.colors.white },
  choiceText: { ...typography.bodySmall },
  selectField: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    minHeight: theme.sizes.inputHeight,
    paddingHorizontal: theme.spacing.sm,
  },
  selectText: { flex: 1 },
  selectLabel: { ...typography.inputPlaceholder, marginBottom: theme.sizes.inputLabelGap },
  selectValue: { ...typography.inputValue },
  countryMenu: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  countrySearch: { ...typography.inputValue, borderBottomColor: theme.colors.border, borderBottomWidth: 1, minHeight: theme.sizes.inputHeight },
  countryList: { maxHeight: 200 },
  countryOption: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.sm },
  countryCode: { ...typography.caption },
  documentTypeChoices: { marginBottom: theme.spacing.sm },
  documentTypeChoice: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  secondaryText: { ...typography.bodySemibold, color: theme.colors.primary },
  cancelButton: { alignItems: 'center', marginTop: theme.spacing.md, padding: theme.spacing.sm },
  error: { ...typography.bodySmall, color: theme.colors.danger, marginBottom: theme.spacing.sm },
});
