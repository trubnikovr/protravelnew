import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SearchStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { FlightResultCard } from '../components/FlightResultCard';
import { useFlightSearch } from '../model/useFlightSearch';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { departure, destination, departureDate, returnDate, passengers } =
    route.params;
  const search = useFlightSearch({
    routes: [
      {
        origin: departure.code,
        destination: destination.code,
        departureDate: new Date(departureDate),
      },
      {
        origin: destination.code,
        destination: departure.code,
        departureDate: new Date(returnDate),
      },
    ],
    passengers: [
      { type: 'adult', count: passengers.adults },
      ...(passengers.children
        ? [{ type: 'child' as const, count: passengers.children }]
        : []),
      ...(passengers.infants + passengers.seatInfants
        ? [
            {
              type: 'infant' as const,
              count: passengers.infants + passengers.seatInfants,
            },
          ]
        : []),
    ],
    cabinClass: 'economy',
    directOnly: false,
    baggageRequired: false,
    preferredAirlines: [],
  });
  const offers = search.data ?? [];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScreenHeader
        onBack={navigation.goBack}
        right={
          <Pressable hitSlop={theme.spacing.md}>
            <SlidersHorizontal color={theme.colors.primary} size={22} />
          </Pressable>
        }
        title={t('search.results')}
      />
      {search.isPending ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.state} />
      ) : search.isError ? (
        <View style={styles.state}>
          <Text style={styles.stateText}>{t('search.loadError')}</Text>
          <Pressable onPress={() => search.refetch()}>
            <Text style={styles.retry}>{t('common.retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summary}>
            <Text style={styles.route}>
              {departure.label} — {destination.label}
            </Text>
            <Text style={styles.meta}>
              {departureDate} ·{' '}
              {Object.values(passengers).reduce((sum, count) => sum + count, 0)}{' '}
              · {t('common.economy')}
            </Text>
          </View>
          <View style={styles.sortRow}>
            <Text style={styles.found}>
              {t('search.foundFlightsCount', { count: offers.length })}
            </Text>
            <Pressable>
              <Text style={styles.sort}>{t('search.cheapestFirst')}</Text>
            </Pressable>
          </View>
          {offers.length === 0 ? (
            <Text style={styles.empty}>{t('search.empty')}</Text>
          ) : (
            offers.map(offer => (
              <FlightResultCard key={offer.id} offer={offer} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    padding: theme.sizes.contentPadding,
  },
  state: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  stateText: {
    ...typography.body,
    textAlign: 'center',
  },
  retry: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  empty: {
    ...typography.body,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  route: {
    ...typography.titleSmall,
    color: theme.colors.white,
  },
  meta: {
    ...typography.bodySmall,
    color: theme.colors.primarySoft,
    marginTop: theme.spacing.xxs,
  },
  sortRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.lg,
  },
  found: {
    ...typography.bodySemibold,
  },
  sort: {
    ...typography.bodySmall,
    color: theme.colors.primary,
  },
});
