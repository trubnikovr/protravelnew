import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography } from '../../../shared/theme/theme';
import type {
  FlightHighlightResponseDto,
  FlightItineraryResponseDto,
  FlightOfferResponseDto,
} from '../../../shared/api/generated/v1/models';

export function formatFlightDuration(
  totalMinutes: number,
  pendingLabel: string,
): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return pendingLabel;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [hours > 0 ? `${hours} ч` : '', minutes > 0 ? `${minutes} мин` : '']
    .filter(Boolean)
    .join(' ');
}

// Keep the provider's local calendar day, regardless of the device time zone.
export function formatFlightDate(value: string): string {
  const day = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return '';
  const date = new Date(`${day}T12:00:00Z`);
  if (!Number.isFinite(date.getTime())) return '';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date).replace('.', '');
}

function formatCarrierName(name: string, code: string): string {
  const normalized = name.trim().toLocaleLowerCase();
  if (!normalized) return code.toLocaleUpperCase();
  const label = `${normalized[0].toLocaleUpperCase()}${normalized.slice(1)}`;
  return label.length > 12 ? `${label.slice(0, 12).trimEnd()}…` : label;
}

export function AviaResultCard({
  offer,
  highlights = [],
  onPress,
}: {
  offer: FlightOfferResponseDto;
  highlights?: FlightHighlightResponseDto[];
  onPress?: () => void;
}) {
  const { t } = useTranslation();
  const price = offer.formatted;
  const baggage = offer.baggageLabel;
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {highlights.length ? (
        <View style={styles.highlights}>
          {highlights.map(highlight => (
            <View
              key={highlight.type}
              style={[
                styles.highlight,
                highlight.type === 'fastest' && styles.highlightFastest,
              ]}
            >
              <Text style={styles.highlightText}>{highlight.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.priceRow}>
        <Text numberOfLines={1} style={styles.price}>
          {price}
        </Text>
        <View style={styles.airlineBadge}>
          <Text numberOfLines={1} style={styles.airline}>
            {formatCarrierName(
              offer.validatingCarrierName,
              offer.validatingCarrierCode,
            )}
          </Text>
        </View>
      </View>
      {baggage ? (
        <View style={styles.badges}>
          <Text style={styles.baggage}>{baggage}</Text>
        </View>
      ) : null}
      <View style={styles.itineraries}>
        {offer.itineraries.map((itinerary, index) => (
          <Itinerary
            itinerary={itinerary}
            key={`${offer.id}-${index}`}
            outbound={index === 0}
            pendingLabel={t('search.durationPending')}
          />
        ))}
      </View>
    </Pressable>
  );
}

function Itinerary({
  itinerary,
  outbound,
  pendingLabel,
}: {
  itinerary: FlightItineraryResponseDto;
  outbound: boolean;
  pendingLabel: string;
}) {
  const first = itinerary.segments[0];
  const last = itinerary.segments.at(-1);
  if (!first || !last) return null;
  const connections = itinerary.segments
    .slice(0, -1)
    .map(segment => segment.destination.name || segment.destination.code)
    .join(', ');
  const Icon = outbound ? ArrowRight : ArrowLeft;
  return (
    <View style={styles.itinerary}>
      <View style={styles.directionIcon}>
        <Icon color={theme.colors.white} size={14} />
      </View>
      <View style={styles.timeBlock}>
        <Text style={styles.time}>{first.departureLocal.slice(11, 16)}</Text>
        <Text style={styles.date}>{formatFlightDate(first.departureLocal)}</Text>
        <Text style={styles.airport}>{first.origin.code}</Text>
      </View>
      <Text style={styles.timeDash}>—</Text>
      <View style={styles.timeBlock}>
        <Text style={styles.time}>{last.arrivalLocal.slice(11, 16)}</Text>
        <Text style={styles.date}>{formatFlightDate(last.arrivalLocal)}</Text>
        <Text style={styles.airport}>{last.destination.code}</Text>
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeSummary}>
          {formatFlightDuration(itinerary.durationMinutes, pendingLabel)}
        </Text>
        {itinerary.stopsLabel ? (
          <Text style={styles.routeSummary}>{itinerary.stopsLabel}</Text>
        ) : null}
        {connections ? (
          <Text numberOfLines={2} style={styles.connections}>
            {connections}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...theme.shadows.homeCard,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.sm,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  highlights: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    left: theme.spacing.md,
    position: 'absolute',
    top: -10,
  },
  highlight: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
  },
  highlightFastest: { backgroundColor: '#55B9E8' },
  highlightText: { ...typography.caption, color: theme.colors.white },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  price: {
    ...typography.titleSmall,
    color: theme.colors.inputValue,
    flex: 1,
    minWidth: 0,
  },
  airlineBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.success,
    borderRadius: theme.radii.tourCard,
    minHeight: theme.sizes.airlineBadgeHeight,
    justifyContent: 'center',
    paddingHorizontal: theme.sizes.airlineBadgeHorizontalPadding,
    flexShrink: 0,
  },
  airline: {
    ...typography.airlineBadge,
  },
  badges: { flexDirection: 'row', marginTop: theme.spacing.xs },
  baggage: {
    ...typography.caption,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.radii.tourCard,
    color: theme.colors.inputValue,
    minHeight: theme.sizes.baggageBadgeHeight,
    lineHeight: theme.sizes.baggageBadgeHeight,
    overflow: 'hidden',
    paddingHorizontal: theme.sizes.baggageBadgeHorizontalPadding,
    textAlign: 'center',
    maxWidth: '100%',
  },
  itineraries: { gap: theme.spacing.md, marginTop: theme.spacing.lg },
  itinerary: { alignItems: 'flex-start', flexDirection: 'row' },
  directionIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    height: 28,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 28,
  },
  timeBlock: { minWidth: 46 },
  time: { ...typography.bodySemibold, color: theme.colors.textStrong },
  date: { ...typography.footnote, color: theme.colors.textSecondary },
  airport: { ...typography.bodySmall, color: theme.colors.textMuted },
  timeDash: { ...typography.bodySemibold, marginHorizontal: theme.spacing.xxs },
  routeInfo: { flex: 1, marginLeft: theme.spacing.sm },
  routeSummary: { ...typography.bodySmall, color: theme.colors.text },
  connections: { ...typography.bodySmall, color: theme.colors.textMuted },
});
