import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { TravelerResponseDto, TravelerDocumentResponseDto } from '../../../shared/api/generated/v1/models';
import { theme, typography } from '../../../shared/theme/theme';

type Props = {
  traveler: TravelerResponseDto;
  document?: TravelerDocumentResponseDto;
  index: number;
  selected: boolean;
  phone?: string | null;
  onPress: () => void;
  last: boolean;
};

function formatDate(value?: Date | null) {
  if (!value || Number.isNaN(value.getTime())) return null;
  return value.toLocaleDateString('ru-RU', { timeZone: 'UTC' });
}

export function AviaPassengerSummary({ traveler, document, index, selected, phone, onPress, last }: Props) {
  const { t } = useTranslation();
  const rows = [
    [t('search.booking.gender'), t(`common.${traveler.gender}`)],
    [t('search.booking.birthDate'), formatDate(traveler.birthDate)],
    [t('search.booking.citizenship'), traveler.citizenshipCountryCode],
    [t('search.booking.documentType'), document ? t(document.type === 'national_passport' ? 'search.booking.nationalPassport' : 'search.booking.internationalPassport') : null],
    [t('search.booking.expiresAt'), formatDate(document?.expiresAt)],
    [t('common.phone'), phone ?? traveler.phone],
  ];

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.passenger, !last && styles.divider]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>
          {[traveler.lastName, traveler.firstName, traveler.middleName].filter(Boolean).join(' ')}
        </Text>
        <View style={styles.number}>
          <Text style={[styles.value, selected && styles.selectedNumber]}>{t('search.booking.passengerNumber', { number: index + 1 })}</Text>
        </View>
      </View>
      <View style={styles.details}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.value}>
              {value || t('search.booking.notSpecified')}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  passenger: { paddingVertical: theme.spacing.md },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.divider },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  name: { ...typography.bodySemibold, flex: 1 },
  number: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xxs },
  details: { gap: theme.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs },
  label: { ...typography.bodySmall, color: theme.colors.inputValue, fontWeight: theme.fonts.weights.semibold },
  value: { ...typography.bodySmall, color: theme.colors.inputPlaceholder },
  selectedNumber: { color: theme.colors.primary },
});
