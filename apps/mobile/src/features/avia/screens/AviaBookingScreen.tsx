import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AviaStackParamList } from '../../../app/navigation/types';
import { PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { useCustomerProfile, useCustomerTravelers } from '../../profile';
import { useCreateAndBookFlightOrder } from '../model/useAviaOrders';
import { AviaBookingDocumentModal } from '../components/AviaBookingDocumentModal';
import { AviaContactEmailModal } from '../components/AviaContactEmailModal';
import { flightOfferRemainingSeconds, useFlightOfferExpiry } from '../model/useFlightOfferExpiry';
import { ApiRequestError, getApiErrorMessage } from '../../../shared/api/api-errors';

type Props = NativeStackScreenProps<AviaStackParamList, 'AviaBooking'>;
const passportTypes = new Set(['national_passport', 'international_passport']);

export function AviaBookingScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const travelers = useCustomerTravelers();
  const profile = useCustomerProfile();
  const booking = useCreateAndBookFlightOrder();
  const expiry = useFlightOfferExpiry(route.params.expiresAt);
  const offerExpired = (!booking.isPending && expiry.expired) || booking.error instanceof ApiRequestError &&
    ['OFFER_EXPIRED', 'FLIGHT_OFFER_NOT_FOUND', 'FLIGHT_OFFER_UNAVAILABLE', 'PRICE_CHANGED'].includes(booking.error.code ?? '');
  const [selectedDocumentByTraveler, setSelectedDocumentByTraveler] = useState<Record<string, string>>({});
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
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
    return <State error={travelers.error ?? profile.error} onBack={navigation.goBack} />;
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
          <Text style={styles.muted}>{t('search.booking.bookedPrice', { price: booking.data.offer.formatted })}</Text>
          <PrimaryButton onPress={() => navigation.popToTop()} title="Готово" />
        </View>
      </SafeAreaView>
    );
  }

  const toggleDocument = (travelerId: string, documentId: string) => {
    setSelectedDocumentByTraveler(current => {
      const next = { ...current };
      if (next[travelerId] === documentId) delete next[travelerId];
      else if (next[travelerId] || Object.keys(next).length < requiredCount) next[travelerId] = documentId;
      return next;
    });
  };
  const selectedPassengers = passportTravelers.filter(item =>
    item.documents.some(doc => doc.id === selectedDocumentByTraveler[item.id]),
  );
  const canSubmit = selectedPassengers.length === requiredCount && Boolean(profile.data.email && profile.data.phone);

  const openDocumentModal = () => {
    setDocumentModalVisible(true);
  };
  const afterDocumentSaved = () => {
    setDocumentModalVisible(false);
  };
  const submit = async () => {
    if (!canSubmit || flightOfferRemainingSeconds(route.params.expiresAt) === 0) return;
    const passengerTypes = [
      ...Array(route.params.passengers.adults).fill('adult' as const),
      ...Array(route.params.passengers.children).fill('child' as const),
      ...Array(route.params.passengers.infants).fill('infant' as const),
    ];
    await booking.mutateAsync({
      offerId: route.params.offerId,
      travelers: selectedPassengers.map((traveler, index) => ({
        travelerId: traveler.id,
        documentId: selectedDocumentByTraveler[traveler.id]!,
        passengerType: passengerTypes[index]!,
      })),
    }).catch(() => undefined);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={offerExpired ? () => navigation.popToTop() : navigation.goBack} title={t('search.booking.title')} />
      <ScrollView contentContainerStyle={styles.content}>
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
                </View>
              );
            })}
            <Pressable onPress={openDocumentModal} style={styles.addAction}>
              <Text style={styles.actionText}>{t('search.booking.addTravelerAndPassport')}</Text>
            </Pressable>
            {travelers.data.length === 0 ? <Text style={styles.muted}>{t('search.booking.noTravelers')}</Text> : null}
            <Text style={styles.muted}>{t('search.booking.passengersSelected', { selected: selectedPassengers.length, required: requiredCount })}</Text>
            <View style={styles.contactCard}>
              <Text style={styles.sectionTitle}>{t('search.booking.contact')}</Text>
              <Text style={styles.muted}>{t('search.booking.phoneLabel')}: {profile.data.phone ?? t('search.booking.phoneRequired')}</Text>
              <Text style={styles.muted}>{t('search.booking.emailLabel')}: {profile.data.email || t('search.booking.emailRequired')}</Text>
              {!profile.data.email ? <Pressable accessibilityRole="button" onPress={() => setEmailModalVisible(true)}><Text style={styles.actionText}>{t('search.booking.addEmail')}</Text></Pressable> : null}
            </View>
            {expiry.countdown && !offerExpired ? <Text style={styles.muted}>{t('search.offerExpiresIn', { time: expiry.countdown })}</Text> : null}
            {expiry.expired && !booking.isPending ? <Text style={styles.error}>{t('search.offerExpired')}</Text> : null}
            {booking.isError && !expiry.expired ? (
              <Text style={styles.error}>
                {getApiErrorMessage(booking.error, t('search.booking.bookingError'))}
              </Text>
            ) : null}
            {offerExpired ? (
              <PrimaryButton onPress={() => navigation.popToTop()} title={t('search.booking.returnToSearch')} />
            ) : (
              <PrimaryButton disabled={!canSubmit} loading={booking.isPending} onPress={submit} title={t('search.booking.book')} />
            )}
      </ScrollView>
      <AviaBookingDocumentModal
        onClose={() => setDocumentModalVisible(false)}
        onSaved={afterDocumentSaved}
        travelers={travelers.data}
        visible={documentModalVisible}
      />
      <AviaContactEmailModal visible={emailModalVisible} onClose={() => setEmailModalVisible(false)} />
    </SafeAreaView>
  );
}

function State({ loading, onBack, error }: { loading?: boolean; onBack: () => void; error?: unknown }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader onBack={onBack} title="Оформление авиабилета" />
      {loading ? <ActivityIndicator color={theme.colors.primary} style={styles.state} /> : <Text style={styles.state}>{getApiErrorMessage(error)}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  content: { padding: theme.sizes.contentPadding, paddingBottom: theme.spacing.xxl },
  state: { ...typography.body, margin: 'auto', textAlign: 'center' },
  sectionTitle: { color: theme.colors.inputValue, fontFamily: theme.fonts.gilroyBold, fontSize: theme.fontSizes.titleSmall, fontWeight: theme.fonts.weights.bold, lineHeight: theme.lineHeights.titleSmall, marginBottom: theme.spacing.sm },
  group: { marginBottom: theme.spacing.md },
  ownerName: { ...typography.bodySemibold, marginBottom: theme.spacing.xs },
  option: { alignItems: 'center', backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radii.sm, borderWidth: 1, flexDirection: 'row', marginBottom: theme.spacing.sm, padding: theme.spacing.md },
  optionSelected: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  optionText: { flex: 1, marginLeft: theme.spacing.sm },
  optionTitle: { ...typography.bodySemibold },
  muted: { ...typography.bodySmall, marginBottom: theme.spacing.sm },
  addAction: { alignItems: 'center', borderColor: theme.colors.primary, borderRadius: theme.radii.sm, borderWidth: 1, marginBottom: theme.spacing.md, padding: theme.spacing.md },
  actionText: { ...typography.bodySemibold, color: theme.colors.primary },
  contactCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.sm, marginVertical: theme.spacing.lg, padding: theme.spacing.md },
  error: { ...typography.bodySmall, color: theme.colors.danger, marginBottom: theme.spacing.md },
  success: { alignItems: 'center', flex: 1, gap: theme.spacing.md, justifyContent: 'center', padding: theme.sizes.contentPadding },
  successTitle: { ...typography.titleSmall },
});
