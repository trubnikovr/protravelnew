import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { useCreateCustomerTourBooking } from '../model/useTourBookings';

type Props = NativeStackScreenProps<ToursStackParamList, 'TourBooking'>;

export function TourBookingScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { phone } = useAuthSession();
  const tour = useTour(route.params.tourId);
  const travelers = useCustomerTravelers();
  const profile = useCustomerProfile();
  const createBooking = useCreateCustomerTourBooking();
  const initializedTravelers = useRef(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTravelerIds, setSelectedTravelerIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (initializedTravelers.current || !travelers.data) return;
    const owner = travelers.data.find(item => item.relationship === 'self');
    if (owner) setSelectedTravelerIds([owner.id]);
    initializedTravelers.current = true;
  }, [travelers.data]);

  if (tour.isPending || travelers.isPending || profile.isPending) {
    return <BookingState loading onBack={navigation.goBack} />;
  }
  if (tour.isError || !tour.data || travelers.isError || profile.isError) {
    return <BookingState onBack={navigation.goBack} />;
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
    selectedTravelerIds.length > 0 &&
    (!requiresDate || selectedDate !== null);

  const toggleTraveler = (travelerId: string) => {
    setSelectedTravelerIds(current =>
      current.includes(travelerId)
        ? current.filter(id => id !== travelerId)
        : [...current, travelerId],
    );
  };

  const submit = async () => {
    if (!canSubmit) return;
    try {
      await createBooking.mutateAsync({
        tourId: data.id,
        travelerIds: selectedTravelerIds,
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
          <Text style={styles.tourTitle}>{data.content.title}</Text>
          <Text style={styles.muted}>{data.price?.formatted ?? ''}</Text>
        </View>

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

        <Section title={t('tourBooking.travelers')}>
          {travelers.data.length ? (
            travelers.data.map(traveler => (
              <TravelerOption
                key={traveler.id}
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
            value={String(selectedTravelerIds.length)}
          />
          <InfoRow
            label={t('tourBooking.pricePerPerson')}
            value={unitPrice.formatted}
          />
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('tourBooking.total')}</Text>
            <Text style={styles.totalValue}>
              {formatTotal(
                unitPrice.amount,
                unitPrice.currency,
                selectedTravelerIds.length,
              )}
            </Text>
          </View>
        </View>
        {createBooking.isError ? (
          <Text style={styles.error}>{t('tourBooking.createError')}</Text>
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
        <PrimaryButton
          disabled={!canSubmit}
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
  onPress,
}: {
  traveler: CustomerTraveler;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
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
  loading,
  onBack,
}: {
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
        <Text style={styles.state}>{t('tourBooking.loadError')}</Text>
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

function formatTotal(amount: string, currency: string, count: number): string {
  const total = BigInt(amount) * BigInt(count);
  return `${total.toLocaleString('ru-RU')} ${currency}`;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  content: {
    padding: theme.sizes.contentPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  summaryCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
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
