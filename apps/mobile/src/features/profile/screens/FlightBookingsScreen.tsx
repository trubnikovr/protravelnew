import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Plane } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import type { FlightOrderResponseDto } from '../../../shared/api/generated/v1/models';
import { useFlightBookings } from '../model/useFlightBookings';

export function FlightBookingsScreen() {
  const { t } = useTranslation();
  const orders = useFlightBookings();
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScreenHeader title={t('profile.flightBookings')} />
      {orders.isPending ? <ActivityIndicator color={theme.colors.primary} style={styles.state} /> : null}
      {orders.isError ? <Text style={styles.state}>{getApiErrorMessage(orders.error, t('profile.flightBookingsError'))}</Text> : null}
      {orders.data?.length === 0 ? (
        <View style={styles.empty}>
          <Plane color={theme.colors.primary} size={42} />
          <Text style={styles.emptyTitle}>{t('profile.flightBookingsEmpty')}</Text>
        </View>
      ) : null}
      {orders.data?.length ? (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl onRefresh={orders.refetch} refreshing={orders.isRefetching} />}
        >
          {orders.data.map(order => <FlightBookingCard key={order.id} order={order} />)}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

function FlightBookingCard({ order }: { order: FlightOrderResponseDto }) {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.carrier}>{order.offer.carrierName || order.offer.carrierCode}</Text>
        <Text style={styles.status}>{t(`profile.flightStatuses.${order.status}`)}</Text>
      </View>
      <Text style={styles.meta}>{order.createdAt.toLocaleDateString('ru-RU')}</Text>
      {order.recordLocator ? <Text style={styles.meta}>{t('profile.recordLocator')}: {String(order.recordLocator)}</Text> : null}
      <Text style={styles.price}>{order.offer.formatted}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  list: { padding: theme.sizes.contentPadding },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, marginBottom: theme.spacing.md, padding: theme.spacing.md, ...theme.shadows.card },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  carrier: { ...typography.bodySemibold, flex: 1 },
  status: { ...typography.caption, color: theme.colors.primary },
  meta: { ...typography.bodySmall, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  price: { ...typography.titleSmall, marginTop: theme.spacing.sm },
  state: { ...typography.body, color: theme.colors.textSecondary, margin: theme.spacing.xl, textAlign: 'center' },
  empty: { alignItems: 'center', flex: 1, gap: theme.spacing.md, justifyContent: 'center', padding: theme.spacing.xl },
  emptyTitle: { ...typography.body, color: theme.colors.textSecondary, textAlign: 'center' },
});
