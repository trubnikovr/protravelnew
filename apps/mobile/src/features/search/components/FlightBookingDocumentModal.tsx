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
import { AppTextField, PrimaryButton } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import {
  createCustomerTraveler,
  createCustomerTravelerDocument,
} from '../../profile/api/travelers.api';
import { customerTravelersQueryKey } from '../../profile/model/useCustomerTravelers';

type Props = {
  visible: boolean;
  travelers: TravelerResponseDto[];
  initialTravelerId?: string;
  startWithNewTraveler?: boolean;
  onClose: () => void;
  onSaved: () => void;
};

type DocumentType = 'national_passport' | 'international_passport';
type Gender = 'male' | 'female';

export function FlightBookingDocumentModal({
  visible,
  travelers,
  initialTravelerId,
  startWithNewTraveler = false,
  onClose,
  onSaved,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [newTraveler, setNewTraveler] = useState(false);
  const [travelerId, setTravelerId] = useState('');
  const [documentType, setDocumentType] =
    useState<DocumentType>('international_passport');
  const [gender, setGender] = useState<Gender>('male');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    citizenship: 'UZ',
    number: '',
    issuingCountry: 'UZ',
    expiresAt: '',
    firstNameLatin: '',
    lastNameLatin: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [documentTypeExpanded, setDocumentTypeExpanded] = useState(false);
  const [citizenshipExpanded, setCitizenshipExpanded] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countries = useQuery({
    enabled: visible && newTraveler,
    queryKey: ['reference', 'countries'],
    queryFn: ({ signal }) => listCountries(signal),
  });
  const hasSelf = useMemo(
    () => travelers.some(traveler => traveler.relationship === 'self'),
    [travelers],
  );
  const selectedTraveler = travelers.find(item => item.id === travelerId);
  const selectedCitizenship = countries.data?.find(country => country.code === form.citizenship);
  const filteredCountries = (countries.data ?? []).filter(country =>
    `${country.name} ${country.code}`.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  useEffect(() => {
    if (!visible) return;
    setError(false);
    setNewTraveler(startWithNewTraveler || travelers.length === 0);
    setTravelerId(initialTravelerId ?? travelers[0]?.id ?? '');
    setDocumentType('international_passport');
    setGender('male');
    setForm({
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '',
      citizenship: 'UZ',
      number: '',
      issuingCountry: 'UZ',
      expiresAt: '',
      firstNameLatin: '',
      lastNameLatin: '',
      phone: '',
      email: '',
    });
    setDocumentTypeExpanded(false);
    setCitizenshipExpanded(false);
    setCountrySearch('');
  }, [initialTravelerId, startWithNewTraveler, travelers, visible]);

  const update = (key: keyof typeof form, value: string) =>
    setForm(current => ({ ...current, [key]: value }));

  const save = async () => {
    setError(false);
    setSaving(true);
    let createdTravelerId: string | null = null;
    try {
      if (
        !form.number.trim() ||
        !form.firstNameLatin.trim() ||
        !form.lastNameLatin.trim() ||
        !/^[A-Za-z]{2}$/.test(form.issuingCountry.trim()) ||
        (form.expiresAt.trim() && !parseDateInput(form.expiresAt))
      ) {
        setError(true);
        return;
      }
      let ownerId = travelerId;
      if (newTraveler) {
        if (
          !form.firstName.trim() ||
          !form.lastName.trim() ||
          !parseDateInput(form.birthDate) ||
          !/^[A-Za-z]{2}$/.test(form.citizenship.trim())
        ) {
          setError(true);
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
        ownerId = owner.id;
        createdTravelerId = owner.id;
      }

      if (!ownerId) {
        setError(true);
        return;
      }

      const document: CreateTravelerDocumentRequestDto = {
        type: documentType,
        number: form.number.trim(),
        issuingCountryCode: form.issuingCountry.trim().toUpperCase(),
        expiresAt: form.expiresAt.trim()
          ? parseDateInput(form.expiresAt)
          : null,
        firstNameLatin: form.firstNameLatin.trim().toUpperCase(),
        lastNameLatin: form.lastNameLatin.trim().toUpperCase(),
      };
      await createCustomerTravelerDocument(ownerId, document);
      await queryClient.invalidateQueries({ queryKey: customerTravelersQueryKey });
      onSaved();
    } catch {
      if (createdTravelerId) {
        await queryClient.invalidateQueries({
          queryKey: customerTravelersQueryKey,
        });
      }
      setError(true);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>{t('search.booking.passengerData')}</Text>
            <Text style={styles.subtitle}>{t('search.booking.passengerDataHint')}</Text>
            <Text style={styles.label}>{t('search.booking.documentOwner')}</Text>
            {!newTraveler ? (
              <View style={styles.ownerList}>
                {travelers.map(traveler => (
                  <Pressable
                    key={traveler.id}
                    onPress={() => setTravelerId(traveler.id)}
                    style={[
                      styles.choice,
                      travelerId === traveler.id && styles.choiceActive,
                    ]}
                  >
                    <Text style={styles.choiceText}>
                      {traveler.lastName} {traveler.firstName}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setNewTraveler(true)}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryText}>
                    {t('search.booking.addTraveler')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                {travelers.length ? (
                  <Pressable
                    onPress={() => {
                      setNewTraveler(false);
                      setTravelerId(initialTravelerId ?? travelers[0]!.id);
                    }}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryText}>
                      {t('search.booking.documentOwner')}: {selectedTraveler?.firstName ?? travelers[0]?.firstName}
                    </Text>
                  </Pressable>
                ) : null}
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
                    label={t('search.booking.lastName')}
                    onChangeText={value => update('lastName', value)}
                    placeholder={t('search.booking.lastName')}
                    value={form.lastName}
                  />
                  <AppTextField
                    label={t('search.booking.firstName')}
                    onChangeText={value => update('firstName', value)}
                    placeholder={t('search.booking.firstName')}
                    value={form.firstName}
                  />
                  <AppTextField
                    label={t('common.middleName')}
                    onChangeText={value => update('middleName', value)}
                    placeholder={t('common.middleName')}
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
              </>
            )}

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
              {newTraveler ? (
                <>
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
                </>
              ) : null}
              <AppTextField
                autoCapitalize="characters"
                label={t('search.booking.firstNameLatin')}
                onChangeText={value => update('firstNameLatin', value)}
                placeholder={t('search.booking.firstNameLatin')}
                value={form.firstNameLatin}
              />
              <AppTextField
                autoCapitalize="characters"
                label={t('search.booking.lastNameLatin')}
                onChangeText={value => update('lastNameLatin', value)}
                placeholder={t('search.booking.lastNameLatin')}
                value={form.lastNameLatin}
              />
            </View>
            {error ? (
              <Text style={styles.error}>{t('search.booking.saveError')}</Text>
            ) : null}
            <PrimaryButton
              loading={saving}
              onPress={save}
              title={t('search.booking.savePassport')}
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
  title: { ...typography.titleSmall, marginBottom: theme.spacing.md },
  subtitle: { ...typography.bodySmall, marginBottom: theme.spacing.md },
  label: { ...typography.bodySemibold, marginBottom: theme.spacing.sm },
  ownerList: { marginBottom: theme.spacing.md },
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
  choice: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  choiceActive: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
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
  secondaryButton: { alignItems: 'center', borderColor: theme.colors.primary, borderRadius: theme.radii.sm, borderWidth: 1, marginBottom: theme.spacing.md, padding: theme.spacing.sm },
  secondaryText: { ...typography.bodySemibold, color: theme.colors.primary },
  cancelButton: { alignItems: 'center', marginTop: theme.spacing.md, padding: theme.spacing.sm },
  error: { ...typography.bodySmall, color: theme.colors.danger, marginBottom: theme.spacing.sm },
});
