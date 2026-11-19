import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Check, Plus, UserRound } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ToursStackParamList } from '../../../app/navigation/types';
import { AppTextField, PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { useTour } from '../../tours';
import {
  useCustomerProfile,
  useCustomerTravelers,
  type CustomerTraveler,
} from '../../profile';
import { useAuthSession } from '../../auth';
import {
  useCreateCustomerTourBooking,
  useTourBookingPriceQuote,
} from '../model/useTourBookings';

type Props = NativeStackScreenProps<ToursStackParamList, 'TourBooking'>;

export function TourBookingScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { phone } = useAuthSession();
  const tour = useTour(route.params.tourId);
  const travelers = useCustomerTravelers();
  const profile = useCustomerProfile();
  const createBooking = useCreateCustomerTourBooking();
  const initializedCount = useRef(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTravelerIds, setSelectedTravelerIds] = useState<string[]>([]);
  const [travelersCount, setTravelersCount] = useState(1);
  const countValid = (!tour.data?.minTravelers || travelersCount >= tour.data.minTravelers) &&
    (!tour.data?.maxTravelers || travelersCount <= tour.data.maxTravelers);
  const quoteEnabled = Boolean(tour.data) && countValid &&
    (!tour.data?.departures.length || selectedDate !== null);
  const priceQuote = useTourBookingPriceQuote(
    route.params.tourId,
    selectedDate,
    travelersCount,
    quoteEnabled,
  );
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (initializedCount.current || !tour.data) return;
    setTravelersCount(tour.data.minTravelers ?? 1);
    initializedCount.current = true;
  }, [tour.data]);

  if (tour.isPending || travelers.isPending || profile.isPending) {
    return <BookingState loading onBack={navigation.goBack} />;
  }
  if (tour.isError || !tour.data || travelers.isError || profile.isError) {
    return <BookingState error={tour.error ?? travelers.error ?? profile.error} onBack={navigation.goBack} />;
  }

  if (createBooking.data) {
    return (
      <BookingSuccess
        bookingNumber={createBooking.data.bookingNumber}
        onBackToTour={() => navigation.popToTop()}
      />
    );
  }

  const data = tour.data;
  const requiresDate = data.departures.length > 0;
  const selectedDeparture = data.departures.find(
    departure =>
      selectedDate && sameLocalDate(departure.departureDate, selectedDate),
  );
  const unitPrice = selectedDeparture?.price ?? data.price;
  const canSubmit =
    termsAccepted &&
    countValid &&
    Boolean(priceQuote.data) &&
    !priceQuote.isFetching &&
    !priceQuote.isError &&
    (!requiresDate || selectedDate !== null);

  const toggleTraveler = (travelerId: string) => {
    setSelectedTravelerIds(current =>
      current.includes(travelerId)
        ? current.filter(id => id !== travelerId)
        : current.length >= travelersCount
        ? current
        : [...current, travelerId],
    );
  };

  const submit = async () => {
    setShowValidation(true);
    if (!canSubmit) {
      if (priceQuote.isError && quoteEnabled) await priceQuote.refetch();
      return;
    }
    try {
      await createBooking.mutateAsync({
        tourId: data.id,
        travelerIds: selectedTravelerIds,
        travelersCount,
        departureDate: selectedDate,
        notes: notes.trim() || null,
      });
    } catch {
      // The mutation state renders a localized recoverable error.
    }
  };


  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={navigation.goBack} title={t('tourBooking.title')} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.reviewTour}>
            {data.coverImage?.url ? <Image source={{ uri: data.coverImage.url }} style={styles.tourImage} /> : null}
            <View style={styles.reviewTourText}>
              <Text style={styles.tourTitle}>{data.content.title}</Text>
              <Text style={styles.muted}>{data.destinations.map(item => [item.countryName, item.cityName].filter(Boolean).join(', ')).join(' · ')}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.reviewPrice}>{priceQuote.data?.formatted ?? data.price?.formatted ?? ''}</Text>
        </View>

        <Section title={t('tourBooking.travelers')}>
          <Text style={styles.muted}>{t('tourBooking.optionalTravelerDetails')}</Text>
          <View style={styles.countRow}>
            <Text style={styles.optionTitle}>{t('tourBooking.people')}</Text>
            <View style={styles.countControls}>
              <Pressable accessibilityRole="button" accessibilityLabel={t('tourBooking.decreaseCount')} disabled={travelersCount <= (data.minTravelers ?? 1)} onPress={() => {
                const next = travelersCount - 1;
                setTravelersCount(next);
                setSelectedTravelerIds(current => current.slice(0, next));
              }} style={styles.countButton}><Text style={styles.countText}>−</Text></Pressable>
              <Text style={styles.optionTitle}>{travelersCount}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={t('tourBooking.increaseCount')} disabled={travelersCount >= (data.maxTravelers ?? 100)} onPress={() => setTravelersCount(value => value + 1)} style={styles.countButton}><Text style={styles.countText}>+</Text></Pressable>
            </View>
          </View>
          {data.minTravelers != null && <Text style={styles.muted}>{t('tourBooking.minTravelers', { count: data.minTravelers })}</Text>}
          {data.maxTravelers != null && <Text style={styles.muted}>{t('tourBooking.maxTravelers', { count: data.maxTravelers })}</Text>}
          {selectedTravelerIds.length >= travelersCount && (
            <Text style={styles.muted}>{t('tourBooking.maximumSelected')}</Text>
          )}
          {travelers.data.length ? (
            travelers.data.map(traveler => (
              <TravelerOption
                key={traveler.id}
                disabled={!selectedTravelerIds.includes(traveler.id) && selectedTravelerIds.length >= travelersCount}
                onPress={() => toggleTraveler(traveler.id)}
                selected={selectedTravelerIds.includes(traveler.id)}
                traveler={traveler}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>{t('tourBooking.noTravelers')}</Text>
          )}
          <Pressable
            onPress={() =>
              navigation.navigate('AddBookingTraveler', {
                isCustomerDefault: travelers.data.length === 0,
              })
            }
            style={styles.addTraveler}
          >
            <Plus color={theme.colors.primary} size={19} />
            <Text style={styles.addTravelerText}>
              {t('tourBooking.addTraveler')}
            </Text>
          </Pressable>
        </Section>


        {requiresDate ? (
          <Section title={t('tourBooking.chooseDate')}>
            {data.departures.map(departure => {
              const selected =
                selectedDate !== null &&
                sameLocalDate(departure.departureDate, selectedDate);
              return (
                <Pressable
                  key={departure.departureDate.toISOString()}
                  onPress={() => setSelectedDate(departure.departureDate)}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <View>
                    <Text style={styles.optionTitle}>
                      {formatDate(departure.departureDate)}
                      {departure.returnDate
                        ? ` — ${formatDate(departure.returnDate)}`
                        : ''}
                    </Text>
                    <Text style={styles.muted}>
                      {[
                        departure.price?.formatted,
                        departure.seatsAvailable != null
                          ? t('tourDetails.seats', {
                              count: departure.seatsAvailable,
                            })
                          : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                  </View>
                  {selected ? (
                    <Check color={theme.colors.primary} size={21} />
                  ) : null}
                </Pressable>
              );
            })}
          </Section>
        ) : null}


        <Section title={t('tourBooking.contacts')}>
          <InfoRow
            label={t('common.phone')}
            value={profile.data.phone ?? phone ?? '—'}
          />
          <InfoRow
            label={t('common.email')}
            value={profile.data.email ?? '—'}
          />
        </Section>

        <AppTextField
          label={t('tourBooking.notes')}
          maxLength={2000}
          multiline
          onChangeText={setNotes}
          placeholder={t('tourBooking.notesPlaceholder')}
          style={styles.notes}
          value={notes}
        />

        <View style={styles.totalCard}>
          <InfoRow
            label={t('tourBooking.people')}
            value={String(travelersCount)}
          />
          <InfoRow
            label={t('tourBooking.pricePerPerson')}
            value={unitPrice.formatted}
          />
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('tourBooking.total')}</Text>
            <Text style={styles.totalValue}>{priceQuote.data?.formatted ?? ''}</Text>
          </View>
        </View>
        {createBooking.isError ? (
          <Text style={styles.error}>{getApiErrorMessage(createBooking.error, t('tourBooking.createError'))}</Text>
        ) : null}
        {priceQuote.isError ? (
          <Text style={styles.error}>{getApiErrorMessage(priceQuote.error, t('tourBooking.createError'))}{'\n'}{t('tourBooking.retryQuote')}</Text>
        ) : null}
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: termsAccepted }}
          onPress={() => setTermsAccepted(value => !value)}
          style={styles.termsRow}
        >
          <View
            style={[styles.checkbox, termsAccepted && styles.checkboxSelected]}
          >
            {termsAccepted ? (
              <Check color={theme.colors.white} size={15} />
            ) : null}
          </View>
          <Text style={styles.terms}>{t('tourBooking.terms')}</Text>
        </Pressable>
        {showValidation && !canSubmit && !priceQuote.isError ? (
          <Text style={styles.submitHint}>
            {!countValid
              ? t('tourBooking.countInvalid')
              : requiresDate && !selectedDate
              ? t('tourBooking.selectDateHint')
              : !termsAccepted
              ? t('tourBooking.acceptTermsHint')
              : t('tourBooking.calculatingPrice')}
          </Text>
        ) : null}
        <PrimaryButton
          loading={createBooking.isPending}
          onPress={submit}
          title={t('tourBooking.confirm')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function TravelerOption({
  traveler,
  selected,
  disabled,
  onPress,
}: {
  traveler: CustomerTraveler;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected, disabled && styles.optionDisabled]}
    >
      <View style={styles.travelerIdentity}>
        <View style={styles.avatar}>
          <UserRound color={theme.colors.primary} size={20} />
        </View>
        <View>
          <Text style={styles.optionTitle}>
            {[traveler.lastName, traveler.firstName, traveler.middleName]
              .filter(Boolean)
              .join(' ')}
          </Text>
          <Text style={styles.muted}>
            {traveler.birthDate
              ? traveler.birthDate.toLocaleDateString('ru-RU')
              : '—'}
          </Text>
        </View>
      </View>
      {selected ? <Check color={theme.colors.primary} size={21} /> : null}
    </Pressable>
  );
}

function Section({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function BookingState({
  error,
  loading,
  onBack,
}: {
  error?: unknown;
  loading?: boolean;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={onBack} title={t('tourBooking.title')} />
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.state} />
      ) : (
        <Text style={styles.state}>{getApiErrorMessage(error, t('tourBooking.loadError'))}</Text>
      )}
    </SafeAreaView>
  );
}

function BookingSuccess({
  bookingNumber,
  onBackToTour,
}: {
  bookingNumber: string;
  onBackToTour: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.success}>
        <View style={styles.successIcon}>
          <Check color={theme.colors.white} size={38} />
        </View>
        <Text style={styles.successTitle}>{t('tourBooking.successTitle')}</Text>
        <Text style={styles.successText}>
          {t('tourBooking.successText', { bookingNumber })}
        </Text>
        <PrimaryButton
          onPress={onBackToTour}
          title={t('tourBooking.backToTours')}
        />
      </View>
    </SafeAreaView>
  );
}

function sameLocalDate(first: Date, second: Date): boolean {
  return first.toISOString().slice(0, 10) === second.toISOString().slice(0, 10);
}

function formatDate(value: Date): string {
  return value.toLocaleDateString('ru-RU');
}

const styles = StyleSheet.create({
  reviewTour: { flexDirection: 'row', gap: theme.spacing.xs },
  tourImage: { width: 61, height: 61, borderRadius: theme.radii.md },
  reviewTourText: { flex: 1, gap: theme.spacing.xs },
  reviewPrice: { ...typography.titleSmall },
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  content: {
    padding: theme.sizes.contentPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  summaryCard: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  tourTitle: { ...typography.titleSmall },
  muted: { ...typography.bodySmall, color: theme.colors.textSecondary },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: { ...typography.titleSmall, marginBottom: theme.spacing.xxs },
  option: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 62,
    padding: theme.spacing.sm,
  },
  optionSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  optionDisabled: { opacity: 0.5 },
  countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countControls: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  countButton: { padding: theme.spacing.sm },
  countText: { ...typography.title, color: theme.colors.primary },
  optionTitle: { ...typography.bodySemibold },
  travelerIdentity: { alignItems: 'center', flexDirection: 'row', flex: 1 },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 38,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 38,
  },
  addTraveler: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
  },
  addTravelerText: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  infoValue: { ...typography.bodySemibold, flex: 1, textAlign: 'right' },
  notes: { height: 76, textAlignVertical: 'top' },
  totalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  divider: { backgroundColor: theme.colors.divider, height: 1 },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: { ...typography.titleSmall },
  totalValue: { ...typography.titleSmall, color: theme.colors.primary },
  error: {
    ...typography.bodySmall,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  submitHint: {
    ...typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  termsRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    marginRight: theme.spacing.xs,
    width: 22,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  terms: {
    ...typography.footnote,
    color: theme.colors.text,
    flex: 1,
  },
  state: {
    ...typography.body,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  success: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.sizes.contentPadding,
  },
  successIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.success,
    borderRadius: theme.radii.pill,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  successTitle: {
    ...typography.title,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  successText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
