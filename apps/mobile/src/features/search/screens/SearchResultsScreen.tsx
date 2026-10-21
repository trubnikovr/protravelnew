import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SearchStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { FlightResultCard } from '../components/FlightResultCard';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation }: Props) {
  const { t } = useTranslation();

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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summary}>
          <Text style={styles.route}>{t('search.route')}</Text>
          <Text style={styles.meta}>{t('search.resultMeta')}</Text>
        </View>
        <View style={styles.sortRow}>
          <Text style={styles.found}>{t('search.foundFlights')}</Text>
          <Pressable>
            <Text style={styles.sort}>{t('search.cheapestFirst')}</Text>
          </Pressable>
        </View>
        <FlightResultCard
          arrival="13:35"
          departure="02:25"
          price="117 350,11 RUB"
        />
        <FlightResultCard
          arrival="18:10"
          departure="07:00"
          price="121 800,00 RUB"
        />
        <FlightResultCard
          arrival="01:20"
          departure="14:10"
          price="129 450,00 RUB"
        />
      </ScrollView>
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
