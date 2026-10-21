import React from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CalendarCheck, Search, UsersRound } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../shared/ui';
import { PrimaryButton } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import type { CustomerTourBooking } from '../api/tour-bookings.api';
import { useCustomerTourBookings } from '../model/useTourBookings';
import { useHostedPayment } from '../../payments/model/usePayment';

export function BookingsScreen() {
  const { t } = useTranslation();
  const bookings = useCustomerTourBookings();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScreenHeader title={t('bookings.title')} />
      {bookings.isPending ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.state} />
      ) : null}
      {bookings.isError ? (
        <Text style={styles.state}>{t('bookings.loadError')}</Text>
      ) : null}
      {bookings.data?.length === 0 ? <EmptyBookings /> : null}
      {bookings.data?.length ? (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              onRefresh={bookings.refetch}
              refreshing={bookings.isRefetching}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {bookings.data.map(booking => (
            <BookingCard booking={booking} key={booking.id} />
          ))}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

function BookingCard({ booking }: { booking: CustomerTourBooking }) {
  const { t } = useTranslation();
  const payment = useHostedPayment();
  const canPay = ['confirmed', 'awaiting_payment'].includes(booking.status);
  const onPay = () => {
    payment.mutate(
      { payableType: 'tour_booking', payableId: booking.id },
      {
        onSuccess: result => {
          Alert.alert(
            result.status === 'succeeded'
              ? t('payments.successTitle')
              : t('payments.pendingTitle'),
            result.status === 'succeeded'
              ? t('payments.successText')
              : t('payments.pendingText'),
          );
        },
        onError: () =>
          Alert.alert(t('payments.errorTitle'), t('payments.errorText')),
      },
    );
  };
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookingNumber}>{booking.bookingNumber}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {t(`bookings.status.${booking.status}`)}
          </Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{booking.tourTitle}</Text>
      {booking.departureDate ? (
        <Text style={styles.cardMeta}>
          {booking.departureDate.toLocaleDateString('ru-RU')}
        </Text>
      ) : null}
      <View style={styles.peopleRow}>
        <UsersRound color={theme.colors.primary} size={18} />
        <Text style={styles.peopleText}>
          {t('bookings.travelersCount', { count: booking.travelersCount })}
        </Text>
        <Text style={styles.price}>{booking.totalPrice.formatted}</Text>
      </View>
      {canPay ? (
        <View style={styles.payButton}>
          <PrimaryButton
            loading={payment.isPending}
            onPress={onPay}
            title={t('payments.pay')}
          />
        </View>
      ) : null}
    </View>
  );
}

function EmptyBookings() {
  const { t } = useTranslation();
  return (
    <View style={styles.empty}>
      <View style={styles.icon}>
        <CalendarCheck color={theme.colors.primary} size={44} />
      </View>
      <Text style={styles.title}>{t('bookings.emptyTitle')}</Text>
      <Text style={styles.text}>{t('bookings.emptyText')}</Text>
      <View style={styles.hint}>
        <Search color={theme.colors.primary} size={19} />
        <Text style={styles.hintText}>{t('bookings.searchHint')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  state: {
    ...typography.body,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  list: { padding: theme.sizes.contentPadding },
  card: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingNumber: { ...typography.caption, color: theme.colors.textSecondary },
  statusBadge: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusText: { ...typography.caption, color: theme.colors.primary },
  cardTitle: { ...typography.titleSmall, marginTop: theme.spacing.sm },
  cardMeta: { ...typography.bodySmall, marginTop: theme.spacing.xs },
  peopleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  peopleText: {
    ...typography.bodySmall,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  price: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    flex: 1,
    textAlign: 'right',
  },
  payButton: { marginTop: theme.spacing.md },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.sizes.contentPadding,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  title: { ...typography.title, marginTop: theme.spacing.xl },
  text: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    maxWidth: 320,
    textAlign: 'center',
  },
  hint: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  hintText: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
});
