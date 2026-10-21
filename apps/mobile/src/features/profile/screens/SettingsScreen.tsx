import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {ProfileStackParamList} from '../../../app/navigation/types';
import {PrimaryButton, ScreenHeader} from '../../../shared/ui';
import {theme, typography} from '../../../shared/theme/theme';
import type {ProfileCurrency} from '../api/profile.api';
import {
  useCustomerProfile,
  useUpdateCustomerProfile,
} from '../model/useCustomerProfile';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

const currencies: ProfileCurrency[] = ['RUB', 'USD', 'EUR'];
const timeZones = ['Asia/Tashkent', 'Europe/Moscow', 'Asia/Almaty'] as const;

export function SettingsScreen({navigation}: Props) {
  const {t} = useTranslation();
  const profile = useCustomerProfile();
  const updateProfile = useUpdateCustomerProfile();
  const [currency, setCurrency] = useState<ProfileCurrency>('RUB');
  const [timeZone, setTimeZone] = useState<string>('Asia/Tashkent');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!profile.data) return;
    setCurrency(profile.data.currency);
    setTimeZone(profile.data.timeZone);
  }, [profile.data]);

  const save = async () => {
    setError(false);
    try {
      await updateProfile.mutateAsync({currency, timeZone});
      navigation.goBack();
    } catch {
      setError(true);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader
        onBack={navigation.goBack}
        title={t('profile.settingsTitle')}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <OptionGroup
            label={t('profile.currency')}
            onSelect={value => setCurrency(value as ProfileCurrency)}
            options={currencies}
            value={currency}
          />
          <OptionGroup
            label={t('profile.timeZone')}
            onSelect={setTimeZone}
            options={timeZones}
            value={timeZone}
          />
        </View>
        {error ? <Text style={styles.error}>{t('profile.saveError')}</Text> : null}
        <View style={styles.footer}>
          <PrimaryButton
            loading={updateProfile.isPending}
            onPress={save}
            title={t('common.save')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map(option => {
          const active = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.option, active && styles.optionActive]}>
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: theme.colors.background, flex: 1},
  content: {flex: 1, padding: theme.sizes.contentPadding},
  card: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  group: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  label: {...typography.bodySemibold, marginBottom: theme.spacing.sm},
  options: {flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs},
  option: {
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  optionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {...typography.bodySmall, color: theme.colors.text},
  optionTextActive: {color: theme.colors.white},
  error: {
    ...typography.bodySmall,
    color: theme.colors.danger,
    marginTop: theme.spacing.md,
  },
  footer: {marginTop: 'auto'},
});
