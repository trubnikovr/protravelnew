import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfileStackParamList } from '../../../app/navigation/types';
import {
  CreateTravelerDocumentRequestDtoTypeEnum,
  type CreateTravelerDocumentRequestDto,
} from '../../../shared/api/generated/v1/models';
import { AppTextField, PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import {
  useCreateCustomerTravelerDocument,
  useCustomerTravelers,
  useDeleteCustomerTraveler,
  useDeleteCustomerTravelerDocument,
  useUpdateCustomerTraveler,
} from '../model/useCustomerTravelers';

type Props = NativeStackScreenProps<ProfileStackParamList, 'TravelerDetails'>;
type Form = { firstName: string; lastName: string; middleName: string; gender: 'male' | 'female' | 'unspecified'; birthDate: string; citizenshipCountryCode: string; phone: string; email: string };
const documentTypes = Object.values(CreateTravelerDocumentRequestDtoTypeEnum);

export function TravelerDetailsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const travelers = useCustomerTravelers();
  const traveler = travelers.data?.find(item => item.id === route.params.travelerId);
  const updateTraveler = useUpdateCustomerTraveler();
  const deleteTraveler = useDeleteCustomerTraveler();
  const createDocument = useCreateCustomerTravelerDocument();
  const deleteDocument = useDeleteCustomerTravelerDocument();
  const [form, setForm] = useState<Form | null>(null);
  const [document, setDocument] = useState({ type: documentTypes[1], number: '', issuingCountryCode: '', issuedAt: '', expiresAt: '', firstNameLatin: '', lastNameLatin: '' });
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!traveler) return;
    setForm(current => current ?? {
      firstName: traveler.firstName,
      lastName: traveler.lastName,
      middleName: traveler.middleName ?? '',
      gender: traveler.gender,
      birthDate: traveler.birthDate?.toISOString().slice(0, 10) ?? '',
      citizenshipCountryCode: traveler.citizenshipCountryCode ?? '',
      phone: traveler.phone ?? '',
      email: traveler.email ?? '',
    });
    setDocument(current => ({
      ...current,
      issuingCountryCode: current.issuingCountryCode || traveler.citizenshipCountryCode || 'UZ',
      firstNameLatin: current.firstNameLatin || traveler.firstNameLatin || traveler.firstName,
      lastNameLatin: current.lastNameLatin || traveler.lastNameLatin || traveler.lastName,
    }));
  }, [traveler]);

  const update = (key: keyof Form, value: string) => setForm(current => current ? { ...current, [key]: value } : current);
  const saveTraveler = async () => {
    if (!traveler || !form) return;
    setError('');
    try {
      await updateTraveler.mutateAsync({
        travelerId: traveler.id,
        input: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          middleName: form.middleName.trim() || null,
          gender: form.gender,
          birthDate: form.birthDate ? new Date(`${form.birthDate}T00:00:00`) : null,
          citizenshipCountryCode: form.citizenshipCountryCode.trim().toUpperCase() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
        },
      });
    } catch (cause) {
      setError(getApiErrorMessage(cause, t('profile.travelerSaveError')));
    }
  };

  const addDocument = async () => {
    if (!traveler) return;
    setError('');
    try {
      const input: CreateTravelerDocumentRequestDto = {
        ...document,
        number: document.number.trim(),
        issuingCountryCode: document.issuingCountryCode.trim().toUpperCase(),
        issuedAt: document.issuedAt ? new Date(`${document.issuedAt}T00:00:00`) : null,
        expiresAt: document.expiresAt ? new Date(`${document.expiresAt}T00:00:00`) : null,
        firstNameLatin: document.firstNameLatin.trim().toUpperCase(),
        lastNameLatin: document.lastNameLatin.trim().toUpperCase(),
      };
      await createDocument.mutateAsync({ travelerId: traveler.id, input });
      setDocument(current => ({ ...current, number: '' }));
    } catch (cause) {
      setError(getApiErrorMessage(cause, t('profile.documentSaveError')));
    }
  };

  const confirmDeleteTraveler = () => Alert.alert(
    t('profile.deleteTravelerTitle'),
    t('profile.deleteTravelerText'),
    [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => deleteTraveler.mutate(traveler!.id, { onSuccess: () => navigation.goBack() }) },
    ],
  );

  if (travelers.isPending || !traveler || !form) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScreenHeader onBack={navigation.goBack} title={t('profile.personal')} />
        <Text style={styles.state}>
          {travelers.isError
            ? getApiErrorMessage(travelers.error, t('profile.travelersError'))
            : travelers.isPending
              ? t('common.loading')
              : t('profile.travelerNotFound')}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={navigation.goBack} title={t('profile.travelerDetails')} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.genderRow}>
            <Text style={styles.formTitle}>{t('profile.gender')}</Text>
            {(['male', 'female', 'unspecified'] as const).map(gender => (
              <Pressable key={gender} onPress={() => update('gender', gender)} style={[styles.typeButton, form.gender === gender && styles.typeButtonActive]}>
                <Text style={[styles.typeText, form.gender === gender && styles.typeTextActive]}>{t(`common.${gender}`)}</Text>
              </Pressable>
            ))}
          </View>
          {(['lastName', 'firstName', 'middleName', 'birthDate', 'citizenshipCountryCode', 'phone', 'email'] as const).map(key => (
            <AppTextField
              key={key}
              autoCapitalize={key === 'email' ? 'none' : 'words'}
              keyboardType={key === 'phone' ? 'phone-pad' : key === 'email' ? 'email-address' : 'default'}
              label={t(`profile.travelerFields.${key}`)}
              onChangeText={value => update(key, value)}
              value={form[key]}
            />
          ))}
          <PrimaryButton disabled={!form.firstName.trim() || !form.lastName.trim()} loading={updateTraveler.isPending} onPress={saveTraveler} title={t('common.save')} />
        </View>

        <Text style={styles.sectionTitle}>{t('profile.documents')}</Text>
        {traveler.documents.map(item => (
          <View key={item.id} style={styles.documentRow}>
            <View style={styles.documentText}>
              <Text style={styles.documentName}>{t(`profile.documentTypes.${item.type}`)}</Text>
              <Text style={styles.detail}>{item.maskedNumber} · {item.issuingCountryCode}</Text>
            </View>
            <Pressable
              accessibilityLabel={t('profile.deleteDocument')}
              hitSlop={theme.spacing.md}
              onPress={() => Alert.alert(t('profile.deleteDocument'), item.maskedNumber, [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('common.delete'), style: 'destructive', onPress: () => deleteDocument.mutate({ travelerId: traveler.id, documentId: item.id }) },
              ])}
            >
              <Trash2 color={theme.colors.danger} size={19} />
            </Pressable>
          </View>
        ))}
        <View style={styles.card}>
          <Text style={styles.formTitle}>{t('profile.addDocument')}</Text>
          <View style={styles.types}>
            {documentTypes.map(type => (
              <Pressable key={type} onPress={() => setDocument(current => ({ ...current, type }))} style={[styles.typeButton, document.type === type && styles.typeButtonActive]}>
                <Text style={[styles.typeText, document.type === type && styles.typeTextActive]}>{t(`profile.documentTypes.${type}`)}</Text>
              </Pressable>
            ))}
          </View>
          <AppTextField label={t('profile.documentNumber')} onChangeText={value => setDocument(current => ({ ...current, number: value }))} value={document.number} />
          <AppTextField label={t('profile.issuingCountry')} onChangeText={value => setDocument(current => ({ ...current, issuingCountryCode: value }))} value={document.issuingCountryCode} />
          <AppTextField label={t('profile.issuedAt')} onChangeText={value => setDocument(current => ({ ...current, issuedAt: value }))} placeholder="ГГГГ-ММ-ДД" value={document.issuedAt} />
          <AppTextField label={t('profile.expiresAt')} onChangeText={value => setDocument(current => ({ ...current, expiresAt: value }))} placeholder="ГГГГ-ММ-ДД" value={document.expiresAt} />
          <AppTextField label={t('profile.firstNameLatin')} onChangeText={value => setDocument(current => ({ ...current, firstNameLatin: value }))} value={document.firstNameLatin} />
          <AppTextField label={t('profile.lastNameLatin')} onChangeText={value => setDocument(current => ({ ...current, lastNameLatin: value }))} value={document.lastNameLatin} />
          <PrimaryButton disabled={!document.number.trim() || !document.issuingCountryCode.trim() || !document.firstNameLatin.trim() || !document.lastNameLatin.trim()} loading={createDocument.isPending} onPress={addDocument} title={t('profile.saveDocument')} />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable onPress={confirmDeleteTraveler} style={styles.deleteButton}>
          <Trash2 color={theme.colors.danger} size={18} />
          <Text style={styles.deleteText}>{t('profile.deleteTraveler')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  content: { padding: theme.sizes.contentPadding, gap: theme.spacing.md },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, padding: theme.spacing.md, gap: theme.spacing.sm },
  sectionTitle: { ...typography.titleSmall },
  formTitle: { ...typography.bodySemibold },
  documentRow: { alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radii.sm, flexDirection: 'row', padding: theme.spacing.md },
  documentText: { flex: 1 },
  documentName: { ...typography.bodySemibold },
  detail: { ...typography.bodySmall, color: theme.colors.textSecondary, marginTop: theme.spacing.xxs },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  genderRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  typeButton: { borderColor: theme.colors.divider, borderRadius: theme.radii.pill, borderWidth: 1, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  typeButtonActive: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  typeText: { ...typography.caption, color: theme.colors.textSecondary },
  typeTextActive: { color: theme.colors.primary },
  deleteButton: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.xs, justifyContent: 'center', padding: theme.spacing.md },
  deleteText: { ...typography.bodySemibold, color: theme.colors.danger },
  state: { ...typography.body, color: theme.colors.textSecondary, margin: theme.spacing.xl, textAlign: 'center' },
  error: { ...typography.bodySmall, color: theme.colors.danger },
});
