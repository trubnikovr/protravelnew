import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowRight, BriefcaseBusiness, Plane} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {theme, typography} from '../../../shared/theme/theme';

export function FlightResultCard({
  price,
  departure,
  arrival,
}: {
  price: string;
  departure: string;
  arrival: string;
}) {
  const {t} = useTranslation();

  return (
    <Pressable style={styles.card}>
      <View style={styles.top}>
        <View style={styles.airline}>
          <View style={styles.logo}>
            <Plane color={theme.colors.white} size={19} />
          </View>
          <View>
            <Text style={styles.airlineName}>{t('search.airline')}</Text>
            <Text style={styles.flightNumber}>
              {t('search.flightNumber')}
            </Text>
          </View>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>

      <View style={styles.route}>
        <Time
          value={departure}
          code="MOW"
          city={t('common.tashkent')}
        />
        <View style={styles.routeCenter}>
          <Text style={styles.duration}>{t('search.duration')}</Text>
          <View style={styles.routeLine}>
            <View style={styles.routeDot} />
            <ArrowRight color={theme.colors.primary} size={18} />
          </View>
          <Text style={styles.direct}>{t('search.direct')}</Text>
        </View>
        <Time
          alignRight
          value={arrival}
          code="PQC"
          city={t('common.phuQuoc')}
        />
      </View>

      <View style={styles.footer}>
        <BriefcaseBusiness color={theme.colors.textSecondary} size={17} />
        <Text style={styles.baggage}>{t('search.handBaggage')}</Text>
      </View>
    </Pressable>
  );
}

function Time({
  value,
  code,
  city,
  alignRight = false,
}: {
  value: string;
  code: string;
  city: string;
  alignRight?: boolean;
}) {
  return (
    <View style={alignRight && styles.alignRight}>
      <Text style={styles.time}>{value}</Text>
      <Text style={styles.code}>{code}</Text>
      <Text style={styles.city}>{city}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  top: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  airline: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    height: 38,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 38,
  },
  airlineName: {
    ...typography.bodySemibold,
  },
  flightNumber: {
    ...typography.caption,
  },
  price: {
    ...typography.titleSmall,
    color: theme.colors.primary,
  },
  route: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
  },
  time: {
    ...typography.titleSmall,
  },
  code: {
    ...typography.bodySemibold,
  },
  city: {
    ...typography.caption,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  routeCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  duration: {
    ...typography.caption,
  },
  routeLine: {
    alignItems: 'center',
    borderBottomColor: theme.colors.primarySoft,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  routeDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    height: 7,
    width: 7,
  },
  direct: {
    ...typography.caption,
    color: theme.colors.success,
    marginTop: theme.spacing.xxs,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  baggage: {
    ...typography.bodySmall,
    marginLeft: theme.spacing.xs,
  },
});
