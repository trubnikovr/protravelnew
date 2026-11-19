import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LocalSvg } from 'react-native-svg/css';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { flightOfferRemainingSeconds, useFlightOfferExpiry } from '../model/useFlightOfferExpiry';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AviaStackParamList } from '../../../app/navigation/types';
import type {
  FlightItineraryResponseDto,
  FlightSegmentResponseDto,
} from '../../../shared/api/generated/v1/models';
import { theme, typography } from '../../../shared/theme/theme';
import { PrimaryButton, TravelStateIcon } from '../../../shared/ui';
import { BookingAuthModal, useAuthSession } from '../../auth';
import { formatFlightDuration } from '../components/AviaResultCard';
import { useAviaOffer } from '../model/useAviaSearch';
import { createFlightShare } from '../api/avia.api';

type Props = NativeStackScreenProps<AviaStackParamList, 'AviaDetails'>;

function formatAirlineName(value: string): string {
  const name = value.trim().toLocaleLowerCase();
  return name.charAt(0).toLocaleUpperCase() + name.slice(1);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(value));
}

function passengerCount(passengers: Props['route']['params']['passengers']) {
  return passengers.adults + passengers.children + passengers.infants;
}

function locationLabel(segment: FlightSegmentResponseDto, origin: boolean) {
  const location = origin ? segment.origin : segment.destination;
  return location.name || location.code;
}

function bookingClass(segment?: FlightSegmentResponseDto): string | null {
  const value: unknown = segment?.bookingClass;
  return typeof value === 'string' && value.trim() ? value : null;
}

function optionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function connectionMinutes(
  current: FlightSegmentResponseDto,
  next: FlightSegmentResponseDto,
): number | null {
  const duration = Math.round(
    (new Date(next.departureLocal).getTime() -
      new Date(current.arrivalLocal).getTime()) /
      60_000,
  );
  return Number.isFinite(duration) && duration > 0 ? duration : null;
}

export function AviaDetailsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const offer = useAviaOffer(route.params.offerId);
  const { session } = useAuthSession();
  const [authVisible, setAuthVisible] = useState(false);
  const [sharePending, setSharePending] = useState(false);
  const data = offer.data;
  const expiry = useFlightOfferExpiry(data?.expiresAt);
  const firstSegment = data?.itineraries[0]?.segments[0];
  const lastOutbound = data?.itineraries[0]?.segments.at(-1);
  const routeTitle =
    firstSegment && lastOutbound
      ? `${locationLabel(firstSegment, true)} – ${locationLabel(
          lastOutbound,
          false,
        )}`
      : t('search.details.title');
  const subtitle = firstSegment
    ? t('search.details.headerSubtitle', {
        count: passengerCount(route.params.passengers),
        date: formatDate(firstSegment.departureLocal),
      })
    : '';

  const openBooking = () => {
    if (!data || flightOfferRemainingSeconds(data.expiresAt) === 0) return;
    if (session) navigation.navigate('AviaBooking', { ...route.params, expiresAt: data.expiresAt?.getTime() > 0 ? data.expiresAt.toISOString() : undefined });
    else setAuthVisible(true);
  };

  const shareOffer = async () => {
    if (!data || sharePending) return;
    setSharePending(true);
    try {
      const share = await createFlightShare(route.params.offerId);
      await Share.share({
        message: `${routeTitle}\n${data.formatted}\n${share.url}`,
        title: routeTitle,
      });
    } catch (error) {
      Alert.alert(getApiErrorMessage(error, t('search.details.shareError')));
    } finally {
      setSharePending(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          hitSlop={12}
          onPress={navigation.goBack}
          style={styles.headerAction}
        >
          <LocalSvg
            asset={require('../../../shared/assets/images/flight-details/back.svg')}
          />
        </Pressable>
        <View style={styles.headerText}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {routeTitle}
          </Text>
          {subtitle ? (
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!data || sharePending}
          hitSlop={12}
          onPress={shareOffer}
          style={styles.headerAction}
        >
          {sharePending ? (
            <ActivityIndicator color={theme.colors.primary} size="small" />
          ) : (
            <LocalSvg
              asset={require('../../../shared/assets/images/flight-details/share.svg')}
            />
          )}
        </Pressable>
      </View>

      {offer.isPending ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.state} />
      ) : offer.isError || !data ? (
        <View style={styles.state}>
          <View style={styles.stateCard}>
            <TravelStateIcon />
            <Text style={styles.stateTitle}>
              {getApiErrorMessage(offer.error, t('search.details.loadError'))}
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FareSummary
            airline={data.validatingCarrierName || data.validatingCarrierCode}
            electronicTicket={data.electronicTicket}
            requiresLatinNames={data.requiresLatinNames}
            segment={firstSegment}
          />
          {data.itineraries.map((itinerary, index) => (
            <ItineraryDetails
              itinerary={itinerary}
              key={`${index}-${itinerary.segments[0]?.departureLocal}`}
            />
          ))}
        </ScrollView>
      )}

      {data ? (
        <View style={styles.bookingBar}>
          <View style={styles.bookingPrice}>
            <Text style={styles.bookingPriceValue}>
              {data.formatted}
            </Text>
            <Text style={styles.bookingPriceLabel}>
              {expiry.expired ? t('search.offerExpired') : expiry.countdown ? t('search.offerExpiresIn', { time: expiry.countdown }) : t('search.details.ticketPrice')}
            </Text>
          </View>
          <View style={styles.bookingButton}>
            <PrimaryButton
              variant="booking"
              onPress={expiry.expired ? () => navigation.popToTop() : openBooking}
              title={expiry.expired ? t('search.booking.returnToSearch') : t('search.details.book')}
            />
          </View>
        </View>
      ) : null}
      <BookingAuthModal
        onAuthenticated={() => {
          setAuthVisible(false);
          if (data && flightOfferRemainingSeconds(data.expiresAt) !== 0) {
            navigation.navigate('AviaBooking', { ...route.params, expiresAt: data.expiresAt?.getTime() > 0 ? data.expiresAt.toISOString() : undefined });
          }
        }}
        onClose={() => setAuthVisible(false)}
        visible={authVisible}
      />
    </SafeAreaView>
  );
}

function FareSummary({
  airline,
  electronicTicket,
  requiresLatinNames,
  segment,
}: {
  airline: string;
  electronicTicket: boolean;
  requiresLatinNames: boolean;
  segment?: FlightSegmentResponseDto;
}) {
  const { t } = useTranslation();
  const classCode = bookingClass(segment);
  return (
    <View style={styles.fareSummary}>
      <Text style={styles.fareAirline}>{formatAirlineName(airline)}</Text>
      {classCode ? (
        <Text style={styles.fareMeta}>
          {t('search.details.bookingClass', { value: classCode })}
        </Text>
      ) : null}
      {electronicTicket ? (
        <FactRow label={t('search.details.eTicket')} />
      ) : null}
      {requiresLatinNames ? (
        <FactRow label={t('search.details.latinNames')} />
      ) : null}
    </View>
  );
}

function FactRow({ label }: { label: string }) {
  return (
    <View style={styles.factRow}>
      <LocalSvg
        asset={require('../../../shared/assets/images/flight-details/check.svg')}
      />
      <Text style={styles.factText}>{label}</Text>
    </View>
  );
}

function ItineraryDetails({
  itinerary,
}: {
  itinerary: FlightItineraryResponseDto;
}) {
  const { t } = useTranslation();
  const first = itinerary.segments[0];
  const last = itinerary.segments.at(-1);
  if (!first || !last) return null;
  return (
    <View style={styles.itinerarySection}>
      <Text style={styles.itineraryTitle}>
        {locationLabel(first, true)} – {locationLabel(last, false)}
      </Text>
      <Text style={styles.itineraryDuration}>
        {formatFlightDuration(
          itinerary.durationMinutes,
          t('search.durationPending'),
        )}
      </Text>
      <View style={styles.itineraryCard}>
        {itinerary.segments.map((segment, index) => {
          const next = itinerary.segments[index + 1];
          const layover = next ? connectionMinutes(segment, next) : null;
          return (
            <React.Fragment
              key={`${segment.carrierCode}-${segment.flightNumber}-${index}`}
            >
              <SegmentDetails segment={segment} />
              {next ? (
                <View style={styles.connection}>
                  <LocalSvg
                    asset={require('../../../shared/assets/images/flight-details/connection.svg')}
                  />
                  <View style={styles.connectionTextWrap}>
                    <Text style={styles.connectionText}>
                      {t('search.details.connection', {
                        city: segment.destination.name,
                      })}
                    </Text>
                    {layover ? (
                      <Text style={styles.connectionDuration}>
                        {formatFlightDuration(
                          layover,
                          t('search.durationPending'),
                        )}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

function SegmentDetails({ segment }: { segment: FlightSegmentResponseDto }) {
  const { t } = useTranslation();
  return (
    <View style={styles.segment}>
      <View style={styles.segmentHeader}>
        <View style={styles.segmentHeaderText}>
          <Text style={styles.segmentAirline}>
            {formatAirlineName(segment.carrierName || segment.carrierCode)}
          </Text>
          <Text style={styles.segmentMeta}>
            {segment.carrierCode}-{segment.flightNumber} {segment.origin.code}{' '}
            – {segment.destination.code}
            {bookingClass(segment) ? ` (${bookingClass(segment)})` : ''}
          </Text>
          <Text style={styles.segmentDuration}>
            {t('search.details.inFlight', {
              duration: formatFlightDuration(
                segment.durationMinutes,
                t('search.durationPending'),
              ),
            })}
          </Text>
        </View>
        <Pressable
          accessibilityLabel={t('search.details.segmentInfo')}
          accessibilityRole="button"
          hitSlop={10}
          onPress={() =>
            Alert.alert(
              t('search.details.segmentInfo'),
              [
                `${segment.carrierCode}-${segment.flightNumber} ${segment.origin.code} – ${segment.destination.code}`,
                segment.baggageLabel,
              ].filter(Boolean).join('\n'),
            )
          }
          style={styles.infoIcon}
        >
          <LocalSvg
            asset={require('../../../shared/assets/images/flight-details/info-mark.svg')}
          />
        </Pressable>
      </View>
      <View style={styles.routeTimeline}>
        <View style={styles.timelineRail}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineLine} />
          <View style={styles.timelineDot} />
        </View>
        <View style={styles.routePoints}>
          <RoutePoint
            location={segment.origin}
            dateTime={segment.departureLocal}
          />
          <RoutePoint
            location={segment.destination}
            dateTime={segment.arrivalLocal}
          />
        </View>
      </View>
      {segment.baggageLabel ? <FactRow label={segment.baggageLabel} /> : null}
    </View>
  );
}

function RoutePoint({
  location,
  dateTime,
}: {
  location: FlightSegmentResponseDto['origin'];
  dateTime: string;
}) {
  const terminal = optionalString(location.terminal);
  return (
    <View style={styles.routePoint}>
      <View style={styles.routeTimeColumn}>
        <Text style={styles.routeTime}>{dateTime.slice(11, 16)}</Text>
        <Text style={styles.routeDate}>
          {new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'short',
            timeZone: 'UTC',
          })
            .format(new Date(dateTime.slice(0, 10) + 'T12:00:00Z'))
            .replace('.', '')}
        </Text>
      </View>
      <View style={styles.routeLocation}>
        <Text numberOfLines={1} style={styles.routeName}>
          {location.name || location.code}
        </Text>
        <Text style={styles.routeMeta}>
          {[location.name, location.code, terminal].filter(Boolean).join(', ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.flightBackground, flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
  },
  headerAction: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 24,
  },
  headerText: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
  },
  headerTitle: { ...typography.flightHeader },
  headerSubtitle: {
    ...typography.flightBody,
    color: theme.colors.inputPlaceholder,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  state: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  stateCard: {
    ...theme.shadows.card,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    margin: theme.sizes.contentPadding,
    padding: theme.spacing.xl,
    width: '85%',
  },
  stateTitle: {
    ...typography.bodySemibold,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  fareSummary: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.tourCard,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  fareAirline: {
    ...typography.flightDetailsAirline,
    color: theme.colors.inputValue,
  },
  fareMeta: {
    ...typography.flightBookingClass,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  factRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  factText: {
    ...typography.flightBody,
    marginLeft: theme.spacing.xxs,
    flex: 1,
  },
  itinerarySection: { marginTop: theme.spacing.md },
  itineraryTitle: {
    ...typography.flightDetailsAirline,
    color: theme.colors.inputValue,
  },
  itineraryDuration: {
    ...typography.flightBody,
    color: theme.colors.inputPlaceholder,
    marginBottom: theme.spacing.xs,
  },
  itineraryCard: {
    ...theme.shadows.homeCard,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.tourCard,
    borderWidth: 1,
    borderColor: theme.colors.flightBorder,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  segment: { gap: theme.spacing.lg },
  segmentHeader: { alignItems: 'center', flexDirection: 'row' },
  segmentHeaderText: { flex: 1 },
  segmentAirline: { ...typography.flightBodySemibold },
  segmentMeta: { ...typography.flightMeta, marginTop: theme.spacing.xxs },
  segmentDuration: {
    ...typography.flightMeta,
    color: theme.colors.inputPlaceholder,
    marginTop: theme.spacing.xxs,
  },
  infoIcon: {
    width: 18,
    height: 18,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.flightSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeTimeline: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xs,
    gap: theme.spacing.lg,
  },
  timelineRail: {
    alignItems: 'center',
    width: 14,
    paddingTop: 2,
    paddingBottom: 20,
  },
  timelineDot: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.flightDot,
    borderRadius: theme.radii.pill,
    borderWidth: 3,
    height: 14,
    width: 14,
  },
  timelineLine: { backgroundColor: theme.colors.flightRail, flex: 1, width: 2 },
  routePoints: { flex: 1, gap: theme.spacing.md },
  routePoint: { alignItems: 'flex-start', flexDirection: 'row', minHeight: 34 },
  routeTimeColumn: { width: 38, marginRight: theme.spacing.lg },
  routeTime: { ...typography.flightBodySemibold },
  routeDate: {
    ...typography.flightMeta,
    color: theme.colors.inputPlaceholder,
    marginTop: theme.spacing.xxs,
  },
  routeLocation: { flex: 1 },
  routeName: { ...typography.flightBodySemibold },
  routeMeta: {
    ...typography.flightMeta,
    color: theme.colors.inputPlaceholder,
    marginTop: theme.spacing.xxs,
  },
  connection: {
    alignItems: 'center',
    backgroundColor: theme.colors.flightConnection,
    borderRadius: theme.radii.tourCard,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md - theme.spacing.xxs,
  },
  connectionTextWrap: { marginLeft: theme.spacing.sm, flex: 1 },
  connectionText: { ...typography.flightBody },
  connectionDuration: {
    ...typography.flightMeta,
    color: theme.colors.inputPlaceholder,
    marginTop: theme.spacing.xxs,
  },
  bookingBar: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.divider,
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopLeftRadius: theme.spacing.sm,
    borderTopRightRadius: theme.spacing.sm,
  },
  bookingPrice: { flex: 1 },
  bookingPriceValue: { ...typography.flightPrice },
  bookingPriceLabel: {
    ...typography.flightBody,
    color: theme.colors.flightSecondary,
  },
  bookingButton: { flexShrink: 0 },
});
