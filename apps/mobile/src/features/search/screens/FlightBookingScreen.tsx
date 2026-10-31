import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Check, UserRound } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SearchStackParamList } from '../../../app/navigation/types';
import { PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { useAuthSession } from '../../auth';
import { useCustomerProfile, useCustomerTravelers } from '../../profile';
import { useCreateAndBookFlightOrder } from '../model/useFlightOrders';
import { FlightBookingDocumentModal } from '../components/FlightBookingDocumentModal';

type Props = NativeStackScreenProps<SearchStackParamList, 'FlightBooking'>;
type Step = 'documents' | 'passengers';
const passportTypes = new Set(['national_passport', 'international_passport']);

export function FlightBookingScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const travelers = useCustomerTravelers();
  const profile = useCustomerProfile();
  const { phone } = useAuthSession();
  const booking = useCreateAndBookFlightOrder();
  const [step, setStep] = useState<Step>('documents');
  const [selectedDocumentByTraveler, setSelectedDocumentByTraveler] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [documentOwnerId, setDocumentOwnerId] = useState<string | undefined>();
  const [modalStartsWithNew, setModalStartsWithNew] = useState(false);
  const requiredCount = Object.values(route.params.passengers).reduce(
    (sum, count) => sum + count,
    0,
  );

  const passportTravelers = useMemo(
    () => (travelers.data ?? []).filter(item => item.documents.some(doc => passportTypes.has(doc.type))),
    [travelers.data],
  );

  if (travelers.isPending || profile.isPending) {
    return <State loading onBack={navigation.goBack} />;
  }
  if (travelers.isError || profile.isError || !profile.data) {
    return <State onBack={navigation.goBack} />;
  }
  if (booking.data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Бронирование создано" />
        <View style={styles.success}>
          <Check color={theme.colors.success} size={48} />
          <Text style={styles.successTitle}>Авиабилет забронирован</Text>
          <Text style={styles.muted}>
            Номер бронирования:{' '}
            {typeof booking.data.recordLocator === 'string' ? booking.data.recordLocator : booking.data.id}
          </Text>
          <PrimaryButton onPress={() => navigation.popToTop()} title="Готово" />
        </View>
      </SafeAreaView>
    );
  }

  const toggleDocument = (travelerId: string, documentId: string) => {
    setSelectedDocumentByTraveler(current => {
      const next = { ...current };
      if (next[travelerId] === documentId) delete next[travelerId];
      else next[travelerId] = documentId;
      return next;
    });
  };
  const togglePassenger = (id: string) =>
    setSelectedIds(current => {
      if (current.includes(id)) return current.filter(value => value !== id);
      return current.length < requiredCount ? [...current, id] : current;
    });
  const selectedPassengers = selectedIds
    .map(id => passportTravelers.find(item => item.id === id))
    .filter((item): item is (typeof passportTravelers)[number] => Boolean(item));
  const selectedPassports = Object.keys(selectedDocumentByTraveler).filter(id =>
    passportTravelers.some(item => item.id === id && item.documents.some(doc => doc.id === selectedDocumentByTraveler[id])),
  );
  const contact = contactFromProfile(profile.data, phone);
  const canSubmit = selectedPassengers.length === requiredCount && contact !== null;

  const openDocumentModal = (ownerId?: string, startNew = false) => {
    setDocumentOwnerId(ownerId);
    setModalStartsWithNew(startNew);
    setDocumentModalVisible(true);
  };
  const afterDocumentSaved = () => {
    setDocumentModalVisible(false);
    setStep('documents');
  };
  const submit = async () => {
    if (!canSubmit || !contact) return;
    const passengerTypes = [
      ...Array(route.params.passengers.adults).fill('adult' as const),
      ...Array(route.params.passengers.children).fill('child' as const),
      ...Array(route.params.passengers.infants).fill('infant' as const),
    ];
    await booking.mutateAsync({
      offerId: route.params.offerId,
      contact,
      travelers: selectedPassengers.map((traveler, index) => ({
        travelerId: traveler.id,
        documentId: selectedDocumentByTraveler[traveler.id]!,
        passengerType: passengerTypes[index]!,
      })),
    }).catch(() => undefined);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={step === 'passengers' ? () => setStep('documents') : navigation.goBack} title={t('search.booking.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        {step === 'documents' ? (
          <>
            <Text style={styles.sectionTitle}>{t('search.booking.chooseDocuments')}</Text>
            {travelers.data.map(traveler => {
              const documents = traveler.documents.filter(doc => passportTypes.has(doc.type));
              return (
                <View key={traveler.id} style={styles.group}>
                  <Text style={styles.ownerName}>{traveler.lastName} {traveler.firstName}</Text>
                  {documents.map(document => {
                    const checked = selectedDocumentByTraveler[traveler.id] === document.id;
                    return (
                      <Pressable key={document.id} onPress={() => toggleDocument(traveler.id, document.id)} style={[styles.option, checked && styles.optionSelected]}>
                        <View style={styles.optionText}>
                          <Text style={styles.optionTitle}>{t(document.type === 'national_passport' ? 'search.booking.nationalPassport' : 'search.booking.internationalPassport')}</Text>
                          <Text style={styles.muted}>{document.maskedNumber}</Text>
                        </View>
                        {checked ? <Check color={theme.colors.primary} size={21} /> : null}
                      </Pressable>
                    );
                  })}
                  {documents.length === 0 ? (
                    <Text style={styles.muted}>{t('search.booking.noPassportForTraveler')}</Text>
                  ) : null}
                  <Pressable onPress={() => openDocumentModal(traveler.id)} style={styles.inlineAction}>
                    <Text style={styles.actionText}>{t('search.booking.addPassport')}</Text>
                  </Pressable>
                </View>
              );
            })}
            <Pressable onPress={() => openDocumentModal(undefined, true)} style={styles.addAction}>
              <Text style={styles.actionText}>{t('search.booking.addTravelerAndPassport')}</Text>
            </Pressable>
            {travelers.data.length === 0 ? <Text style={styles.muted}>{t('search.booking.noTravelers')}</Text> : null}
            <Text style={styles.muted}>{t('search.booking.documentsSelected', { selected: selectedPassports.length })}</Text>
            <PrimaryButton disabled={selectedPassports.length < requiredCount} onPress={() => {
              setSelectedIds(current => current.filter(id => selectedPassports.includes(id)));
              setStep('passengers');
            }} title={t('search.booking.continue')} />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>{t('search.booking.passengersSelected', { selected: selectedIds.length, required: requiredCount })}</Text>
            <Text style={styles.muted}>{t('search.booking.choosePassengers')}</Text>
            {passportTravelers.filter(item => selectedPassports.includes(item.id)).map(traveler => {
              const checked = selectedIds.includes(traveler.id);
              const selectedIndex = selectedIds.indexOf(traveler.id);
              const document = traveler.documents.find(item => item.id === selectedDocumentByTraveler[traveler.id]);
              return (
                <Pressable key={traveler.id} onPress={() => togglePassenger(traveler.id)} style={[styles.option, checked && styles.optionSelected]}>
                  <UserRound color={theme.colors.primary} size={21} />
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{traveler.lastName} {traveler.firstName}</Text>
                    <Text style={styles.muted}>{document?.maskedNumber}</Text>
                    {checked ? <Text style={styles.muted}>{t(`search.booking.${passengerTypeAt(selectedIndex, route.params.passengers)}`)}</Text> : null}
                  </View>
                  {checked ? <Check color={theme.colors.primary} size={21} /> : null}
                </Pressable>
              );
            })}
            <Pressable onPress={() => openDocumentModal(undefined, true)} style={styles.addAction}>
              <Text style={styles.actionText}>{t('search.booking.addTravelerAndPassport')}</Text>
            </Pressable>
            <View style={styles.contactCard}>
              <Text style={styles.sectionTitle}>{t('search.booking.contact')}</Text>
              <Text style={styles.muted}>{profile.data.email ?? 'Укажите e-mail в профиле'}</Text>
              <Text style={styles.muted}>{profile.data.phone ?? phone ?? 'Укажите телефон в профиле'}</Text>
            </View>
            {booking.isError ? <Text style={styles.error}>{t('search.booking.bookingError')}</Text> : null}
            <PrimaryButton disabled={!canSubmit} loading={booking.isPending} onPress={submit} title={t('search.booking.book')} />
          </>
        )}
      </ScrollView>
      <FlightBookingDocumentModal
        initialTravelerId={documentOwnerId}
        onClose={() => setDocumentModalVisible(false)}
        onSaved={afterDocumentSaved}
        startWithNewTraveler={modalStartsWithNew}
        travelers={travelers.data}
        visible={documentModalVisible}
      />
    </SafeAreaView>
  );
}

function contactFromProfile(profile: { firstName: string; lastName?: string | null; email?: string | null; phone?: string | null }, fallbackPhone: string | null) {
  const digits = (profile.phone ?? fallbackPhone ?? '').replace(/\D/g, '');
  if (!profile.email || digits.length < 9) return null;
  const countryLength = digits.startsWith('998') ? 3 : 1;
  return {
    name: [profile.firstName, profile.lastName].filter(Boolean).join(' '),
    email: profile.email,
    countryCode: digits.slice(0, countryLength),
    areaCode: digits.slice(countryLength, countryLength + 2),
    phone: digits.slice(countryLength + 2),
  };
}

function passengerTypeAt(index: number, passengers: { adults: number; children: number; infants: number }) {
  if (index < passengers.adults) return 'adult';
  if (index < passengers.adults + passengers.children) return 'child';
  return 'infant';
}

function State({ loading, onBack }: { loading?: boolean; onBack: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader onBack={onBack} title="Оформление авиабилета" />
      {loading ? <ActivityIndicator color={theme.colors.primary} style={styles.state} /> : <Text style={styles.state}>Не удалось загрузить данные для бронирования.</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  content: { padding: theme.sizes.contentPadding, paddingBottom: theme.spacing.xxl },
  state: { ...typography.body, margin: 'auto', textAlign: 'center' },
  sectionTitle: { ...typography.bodySemibold, marginBottom: theme.spacing.sm },
  group: { marginBottom: theme.spacing.md },
  ownerName: { ...typography.bodySemibold, marginBottom: theme.spacing.xs },
  option: { alignItems: 'center', backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radii.sm, borderWidth: 1, flexDirection: 'row', marginBottom: theme.spacing.sm, padding: theme.spacing.md },
  optionSelected: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  optionText: { flex: 1, marginLeft: theme.spacing.sm },
  optionTitle: { ...typography.bodySemibold },
  muted: { ...typography.bodySmall, marginBottom: theme.spacing.sm },
  inlineAction: { padding: theme.spacing.sm },
  addAction: { alignItems: 'center', borderColor: theme.colors.primary, borderRadius: theme.radii.sm, borderWidth: 1, marginBottom: theme.spacing.md, padding: theme.spacing.md },
  actionText: { ...typography.bodySemibold, color: theme.colors.primary },
  contactCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.sm, marginVertical: theme.spacing.lg, padding: theme.spacing.md },
  error: { ...typography.bodySmall, color: theme.colors.danger, marginBottom: theme.spacing.md },
  success: { alignItems: 'center', flex: 1, gap: theme.spacing.md, justifyContent: 'center', padding: theme.sizes.contentPadding },
  successTitle: { ...typography.titleSmall },
});
