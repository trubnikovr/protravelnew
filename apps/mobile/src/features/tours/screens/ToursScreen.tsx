import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SlidersHorizontal, X } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ToursStackParamList } from '../../../app/navigation/types';
import { TourCard, tourLocation } from '../components/TourCard';
import { useTours } from '../model/useTours';
import { FilterChoice, PrimaryButton, ScreenHeader, TravelStateCard } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';

type Props = NativeStackScreenProps<ToursStackParamList, 'TourCatalog'>;
type Sort = 'recommended' | 'price';

type Filters = {
  destination: DestinationFilter | null;
  sort: Sort;
};

type DestinationFilter = { label: string; value: string };

const initialFilters: Filters = {
  destination: null,
  sort: 'recommended',
};

export function ToursScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(initialFilters);
  const [draft, setDraft] = useState(initialFilters);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const catalog = useTours({
    destination: filters.destination?.value,
    sort: filters.sort,
  });
  const allCatalog = useTours({ sort: 'recommended' });
  const destinations = useMemo(
    () =>
      Array.from(
        new Map(
          (allCatalog.data ?? []).flatMap(tour =>
            tour.destinations.map(destination => {
              const label = tourLocation({
                ...tour,
                destinations: [destination],
              });
              return [
                label,
                {
                  label,
                  value: destination.cityName ?? destination.countryName,
                },
              ] as const;
            }),
          ),
        ).values(),
      ),
    [allCatalog.data],
  );
  const tours = catalog.data ?? [];

  const openFilters = () => {
    setDraft(filters);
    setFiltersVisible(true);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ImageBackground
        imageStyle={styles.backgroundImage}
        source={require('../../../shared/assets/images/tours-background.png')}
        style={styles.background}
      />
      <ScreenHeader
        right={
          <Pressable
            accessibilityLabel={t('tours.filters')}
            hitSlop={theme.spacing.md}
            onPress={openFilters}
          >
            <SlidersHorizontal color={theme.colors.primary} size={23} />
          </Pressable>
        }
        title={t('tours.title')}
      />
      {catalog.isPending ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.state} />
      ) : catalog.isError ? (
        <ScrollView
          contentContainerStyle={styles.errorContent}
          refreshControl={
            <RefreshControl
              refreshing={catalog.isFetching}
              onRefresh={() => catalog.refetch()}
            />
          }
        >
          <TravelStateCard
            title={t('tours.catalogLoadError')}
            message={t('common.connectionUnavailable')}
            actionLabel={t('common.retry')}
            onAction={() => catalog.refetch()}
          />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {(filters.destination || filters.sort !== 'recommended') && (
            <View style={styles.resultHeader}>
              <View />
              <Pressable onPress={() => setFilters(initialFilters)}>
                <Text style={styles.resetText}>{t('tours.reset')}</Text>
              </Pressable>
            </View>
          )}
          {tours.length === 0 ? (
            <Text style={styles.empty}>{t('tours.empty')}</Text>
          ) : (
            <View style={styles.grid}>
              {tours.map(tour => (
                <View key={tour.id} style={styles.cell}>
                  <TourCard
                    tour={tour}
                    onPress={() =>
                      navigation.navigate('TourDetails', { tourId: tour.id })
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
      <TourFiltersSheet
        destinations={destinations}
        filters={draft}
        onApply={() => {
          setFilters(draft);
          setFiltersVisible(false);
        }}
        onChange={setDraft}
        onClose={() => setFiltersVisible(false)}
        visible={filtersVisible}
      />
    </SafeAreaView>
  );
}

function TourFiltersSheet({
  visible,
  filters,
  destinations,
  onChange,
  onApply,
  onClose,
}: {
  visible: boolean;
  filters: Filters;
  destinations: DestinationFilter[];
  onChange: (filters: Filters) => void;
  onApply: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable onPress={onClose} style={styles.backdrop}>
        <Pressable onPress={() => undefined} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t('tours.filters')}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X color={theme.colors.text} size={21} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t('tours.destination')}</Text>
            <View style={styles.chips}>
              <FilterChoice
                label={t('tours.anyDestination')}
                onPress={() => onChange({ ...filters, destination: null })}
                selected={!filters.destination}
              />
              {destinations.map(destination => (
                <FilterChoice
                  key={destination.label}
                  label={destination.label}
                  onPress={() => onChange({ ...filters, destination })}
                  selected={filters.destination?.value === destination.value}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>{t('tours.sort')}</Text>
            <View style={styles.chips}>
              <FilterChoice
                label={t('tours.recommended')}
                onPress={() => onChange({ ...filters, sort: 'recommended' })}
                selected={filters.sort === 'recommended'}
              />
              <FilterChoice
                label={t('tours.byPrice')}
                onPress={() => onChange({ ...filters, sort: 'price' })}
                selected={filters.sort === 'price'}
              />
            </View>
          </ScrollView>
          <PrimaryButton onPress={onApply} title={t('common.apply')} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  background: { ...StyleSheet.absoluteFill },
  backgroundImage: { resizeMode: 'cover' },
  content: { padding: theme.sizes.contentPadding },
  state: { flex: 1, justifyContent: 'center' },
  errorContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.sizes.contentPadding,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  resetText: { ...typography.bodySmall, color: theme.colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  cell: { width: '48%' },
  empty: {
    ...typography.body,
    color: theme.colors.textSecondary,
    paddingVertical: theme.spacing.xxxl,
    textAlign: 'center',
  },
  backdrop: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    maxHeight: '88%',
    padding: theme.sizes.contentPadding,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    height: 4,
    marginBottom: theme.spacing.sm,
    width: 42,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetTitle: { ...typography.titleSmall },
  closeButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  sectionTitle: { ...typography.bodySemibold, marginTop: theme.spacing.lg },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
});
