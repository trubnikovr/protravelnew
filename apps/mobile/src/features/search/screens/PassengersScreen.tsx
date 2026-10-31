import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Minus, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../../../shared/ui/PrimaryButton';
import { theme, typography } from '../../../shared/theme/theme';
import type { SearchStackParamList } from '../../../app/navigation/types';

type Props = NativeStackScreenProps<SearchStackParamList, 'Passengers'>;

export function PassengersScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const [passengers, setPassengers] = useState([
    {
      id: 'adults' as const,
      labelKey: 'search.adults',
      hintKey: 'search.adultsHint',
      value: route.params.passengers.adults,
    },
    {
      id: 'children' as const,
      labelKey: 'search.children',
      hintKey: 'search.childrenHint',
      value: route.params.passengers.children,
    },
    {
      id: 'infants' as const,
      labelKey: 'search.infants',
      hintKey: 'search.infantsHint',
      value: route.params.passengers.infants,
    },
  ]);

  const update = (id: string, delta: number) => {
    setPassengers(items =>
      items.map(item => ({
        ...item,
        value:
          item.id === id
            ? Math.max(item.id === 'adults' ? 1 : 0, item.value + delta)
            : item.value,
      })),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable hitSlop={theme.spacing.md} onPress={navigation.goBack}>
          <ArrowLeft color={theme.colors.text} size={23} />
        </Pressable>
        <Text style={styles.title}>{t('search.passengersTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.card}>
        {passengers.map(item => (
          <View key={item.id} style={styles.passengerRow}>
            <View style={styles.passengerText}>
              <Text style={styles.passengerLabel}>{t(item.labelKey)}</Text>
              <Text style={styles.passengerHint}>{t(item.hintKey)}</Text>
            </View>
            <CounterButton
              disabled={item.value <= (item.id === 'adults' ? 1 : 0)}
              icon="minus"
              onPress={() => update(item.id, -1)}
            />
            <Text style={styles.count}>{item.value}</Text>
            <CounterButton
              icon="plus"
              onPress={() => update(item.id, 1)}
              primary
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>{t('search.serviceClass')}</Text>
          <Text style={styles.fieldValue}>{t('common.economy')}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          onPress={() =>
            navigation.popTo('SearchForm', {
              passengers: Object.fromEntries(
                passengers.map(item => [item.id, item.value]),
              ) as typeof route.params.passengers,
            })
          }
          title={t('common.apply')}
        />
      </View>
    </SafeAreaView>
  );
}

function CounterButton({
  icon,
  onPress,
  primary = false,
  disabled = false,
}: {
  icon: 'minus' | 'plus';
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  const Icon = icon === 'plus' ? Plus : Minus;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.counterButton,
        primary && styles.counterButtonPrimary,
        disabled && styles.counterButtonDisabled,
      ]}
    >
      <Icon
        color={primary ? theme.colors.white : theme.colors.textSecondary}
        size={17}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    height: theme.sizes.headerHeight,
    justifyContent: 'space-between',
    paddingHorizontal: theme.sizes.contentPadding,
  },
  title: {
    ...typography.bodySemibold,
  },
  headerSpacer: {
    width: 23,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    margin: theme.sizes.contentPadding,
    padding: theme.spacing.md,
  },
  passengerRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 72,
  },
  passengerText: {
    flex: 1,
  },
  passengerLabel: {
    ...typography.bodySemibold,
  },
  passengerHint: {
    ...typography.bodySmall,
  },
  counterButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  counterButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  counterButtonDisabled: {
    opacity: 0.45,
  },
  count: {
    ...typography.bodySemibold,
    minWidth: 38,
    textAlign: 'center',
  },
  field: {
    borderColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.sm,
  },
  fieldLabel: {
    ...typography.caption,
    color: theme.colors.primary,
  },
  fieldValue: {
    ...typography.bodySemibold,
  },
  footer: {
    marginTop: 'auto',
    padding: theme.sizes.contentPadding,
  },
});
