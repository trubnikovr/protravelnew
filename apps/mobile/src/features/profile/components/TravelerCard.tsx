import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Trash2} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {theme, typography} from '../../../shared/theme/theme';
import type {CustomerTraveler} from '../api/travelers.api';

export function TravelerCard({
  traveler,
  onDelete,
}: {
  traveler: CustomerTraveler;
  onDelete: () => void;
}) {
  const {t} = useTranslation();
  const document = traveler.documents[0];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {[traveler.lastName, traveler.firstName, traveler.middleName]
            .filter(Boolean)
            .join(' ')}
        </Text>
        <Pressable hitSlop={theme.spacing.md} onPress={onDelete}>
          <Trash2 color={theme.colors.danger} size={20} />
        </Pressable>
      </View>
      <Detail label={t('profile.gender')} value={t(`common.${traveler.gender}`)} />
      <Detail
        label={t('common.birthDate')}
        value={
          traveler.birthDate
            ? traveler.birthDate.toLocaleDateString('ru-RU')
            : '—'
        }
      />
      <Detail
        label={t('common.citizenship')}
        value={traveler.citizenshipCountryCode ?? '—'}
      />
      <Detail
        label={t('common.documentNumber')}
        value={document?.maskedNumber ?? '—'}
      />
      <Detail label={t('common.phone')} value={traveler.phone ?? '—'} />
      <Detail label={t('common.email')} value={traveler.email ?? '—'} />
    </View>
  );
}

function Detail({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  name: {...typography.bodySemibold, flex: 1},
  detail: {flexDirection: 'row', marginBottom: theme.spacing.xxs},
  detailLabel: {
    ...typography.bodySmall,
    color: theme.colors.textStrong,
    fontWeight: theme.fonts.weights.semibold,
  },
  detailValue: {...typography.bodySmall, flex: 1, marginLeft: theme.spacing.xs},
});
