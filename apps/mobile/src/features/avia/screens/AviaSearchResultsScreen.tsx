import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Lightbulb,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AviaStackParamList } from '../../../app/navigation/types';
import {
  PrimaryButton,
  FilterChoice,
  ScreenHeader,
  TravelStateCard,
} from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { AviaResultCard } from '../components/AviaResultCard';
import { useAviaSearch } from '../model/useAviaSearch';
import { useTravelFacts } from '../model/useAviaTravelFact';
import type {
  CreateFlightSearchRequestDtoSortByEnum,
  FlightHighlightResponseDto,
  FlightSearchFiltersResponseDto,
  TravelFactResponseDto,
} from '../../../shared/api/generated/v1/models';

type Props = NativeStackScreenProps<AviaStackParamList, 'AviaSearchResults'>;

type StopsFilter = 'any' | number;
type FilterSection = 'top' | 'airlines';
const cabinClassLabelKey = {
  economy: 'economy',
  premium_economy: 'premiumEconomy',
  business: 'business',
  first: 'first',
} as const;

type FlightFilters = {
  stops: StopsFilter;
  baggageRequired: boolean;
  preferredAirlines: string[];
  minPrice: string;
  maxPrice: string;
  maxDurationHours: string;
  sortBy: CreateFlightSearchRequestDtoSortByEnum;
};

const defaultFilters: FlightFilters = {
  stops: 'any',
  baggageRequired: false,
  preferredAirlines: [],
  minPrice: '',
  maxPrice: '',
  maxDurationHours: '',
  sortBy: 'recommended',
};

function toMinorUnits(value: string): string | undefined {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return undefined;
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0
    ? Math.round(amount * 100).toString()
    : undefined;
}

function toMinutes(value: string): number | undefined {
  const hours = Number(value.trim().replace(',', '.'));
  return Number.isFinite(hours) && hours > 0
    ? Math.round(hours * 60)
    : undefined;
}

function useCyclingIndex(length: number, intervalMs: number): number {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(0);
    if (length < 2) return;
    const interval = setInterval(
      () => setIndex(current => (current + 1) % length),
      intervalMs,
    );
    return () => clearInterval(interval);
  }, [intervalMs, length]);
  return index;
}

export function AviaSearchResultsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterSection, setFilterSection] = useState<FilterSection>('top');
  const [filters, setFilters] = useState<FlightFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] =
    useState<FlightFilters>(defaultFilters);
  const [availableFilters, setAvailableFilters] =
    useState<FlightSearchFiltersResponseDto>();
  const {
    departure,
    destination,
    departureDate,
    returnDate,
    passengers,
    cabinClass,
  } = route.params;
  const request = useMemo(
    () => ({
      routes: [
        {
          origin: departure.code,
          destination: destination.code,
          originAirports: departure.airportCodes,
          destinationAirports: destination.airportCodes,
          departureDate: new Date(departureDate),
        },
        ...(returnDate
          ? [
              {
                origin: destination.code,
                destination: departure.code,
                originAirports: destination.airportCodes,
                destinationAirports: departure.airportCodes,
                departureDate: new Date(returnDate),
              },
            ]
          : []),
      ],
      passengers: [
        { type: 'adult' as const, count: passengers.adults },
        ...(passengers.children
          ? [{ type: 'child' as const, count: passengers.children }]
          : []),
        ...(passengers.infants
          ? [
              {
                type: 'infant' as const,
                count: passengers.infants,
              },
            ]
          : []),
      ],
      cabinClass,
      stopsCount: filters.stops === 'any' ? undefined : filters.stops,
      baggageRequired: filters.baggageRequired,
      preferredAirlines: filters.preferredAirlines,
      minPrice: toMinorUnits(filters.minPrice),
      maxPrice: toMinorUnits(filters.maxPrice),
      maxDurationMinutes: toMinutes(filters.maxDurationHours),
      sortBy: filters.sortBy,
      page: 1,
      limit: 20,
    }),
    [
      departure.code,
      departure.airportCodes,
      departureDate,
      destination.code,
      destination.airportCodes,
      cabinClass,
      filters,
      passengers,
      returnDate,
    ],
  );
  const search = useAviaSearch(request, route.key);
  const { offers, highlights, filters: receivedFilters } = search;
  const highlightsByOffer = new Map<string, FlightHighlightResponseDto[]>();
  for (const highlight of highlights) {
    highlightsByOffer.set(highlight.offerId, [
      ...(highlightsByOffer.get(highlight.offerId) ?? []),
      highlight,
    ]);
  }
  useEffect(() => {
    if (receivedFilters) {
      setAvailableFilters(receivedFilters);
    }
  }, [receivedFilters]);
  const passengerCount = Object.values(passengers).reduce(
    (total, count) => total + count,
    0,
  );
  const activeFilters =
    Number(filters.stops !== 'any') +
    Number(filters.baggageRequired) +
    Number(filters.preferredAirlines.length > 0) +
    Number(!!filters.minPrice || !!filters.maxPrice) +
    Number(!!filters.maxDurationHours);

  const openFilters = (section: FilterSection = 'top') => {
    setFilterSection(section);
    setDraftFilters(filters);
    setFiltersVisible(true);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScreenHeader
        onBack={navigation.goBack}
        subtitle={`${t(`common.${cabinClassLabelKey[cabinClass]}`)} · ${t(
          'search.passengerCount',
          { count: passengerCount },
        )}`}
        title={`${departure.label} — ${destination.label}`}
      />
      {search.isPending ? (
        <FlightSearchLoading destinationCode={destination.code} />
      ) : search.isError ? (
        <ScrollView
          alwaysBounceVertical
          contentContainerStyle={styles.state}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              onRefresh={() => search.refetch()}
              refreshing={false}
              tintColor={theme.colors.primary}
            />
          }
        >
          <TravelStateCard
            actionLabel={t('common.retry')}
            message={getApiErrorMessage(search.error, t('search.loadError'))}
            onAction={() => search.refetch()}
            title={t('search.loadErrorTitle')}
          />
        </ScrollView>
      ) : (
        <FlatList
          alwaysBounceVertical
          contentContainerStyle={styles.content}
          data={offers}
          keyExtractor={offer => offer.id}
          renderItem={({ item }) => (
            <AviaResultCard
              highlights={highlightsByOffer.get(item.id)}
              offer={item}
              onPress={() =>
                navigation.navigate('AviaDetails', {
                  offerId: item.id,
                  passengers,
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <TravelStateCard
                actionLabel={t('search.changeSearch')}
                message={t('search.empty')}
                onAction={navigation.goBack}
                title={t('search.emptyTitle')}
              />
            </View>
          }
          ListHeaderComponent={
            <ResultsHeader
              activeFilters={activeFilters}
              onFilters={openFilters}
            />
          }
          ListFooterComponent={
            search.isFetchingNextPage ? (
              <Text style={styles.loadingMore}>{t('search.loadingMore')}</Text>
            ) : null
          }
          onEndReached={() => {
            if (search.hasNextPage && !search.isFetchingNextPage) {
              search.fetchNextPage().catch(() => undefined);
            }
          }}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              onRefresh={() => search.refetch()}
              refreshing={false}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
      <FiltersModal
        initialSection={filterSection}
        available={availableFilters ?? receivedFilters}
        filters={draftFilters}
        onApply={() => {
          setFilters(draftFilters);
          setFiltersVisible(false);
        }}
        onChange={setDraftFilters}
        onClose={() => setFiltersVisible(false)}
        onReset={() => setDraftFilters(defaultFilters)}
        visible={filtersVisible}
      />
    </SafeAreaView>
  );
}

function ResultsHeader({
  activeFilters,
  onFilters,
}: {
  activeFilters: number;
  onFilters: (section?: FilterSection) => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.resultsHeader}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.quickFilters}>
          <Pressable onPress={() => onFilters('top')} style={styles.swapFilter}>
            <ArrowLeftRight
              color={activeFilters ? theme.colors.danger : theme.colors.text}
              size={18}
            />
            {activeFilters ? (
              <View style={styles.filterIconBadge}>
                <Text style={styles.filterIconBadgeText}>{activeFilters}</Text>
              </View>
            ) : null}
          </Pressable>
          {[
            t('search.airlinesTitle'),
            t('search.airportsTitle'),
            t('search.flightTitle'),
          ].map((label, index) => (
            <Pressable
              key={label}
              onPress={() => onFilters(index === 0 ? 'airlines' : 'top')}
              style={styles.quickFilter}
            >
              <Text style={styles.quickFilterText}>{label}</Text>
              <ChevronDown color={theme.colors.textSecondary} size={16} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function FlightSearchLoading({ destinationCode }: { destinationCode: string }) {
  const travelFacts = useTravelFacts(destinationCode);
  const facts = travelFacts.data ?? [];
  const factIndex = useCyclingIndex(facts.length, 7000);
  return (
    <View style={styles.loadingState}>
      <View pointerEvents="none" style={styles.skeletonList}>
        {[0, 1, 2].map(item => <FlightResultSkeleton key={item} />)}
      </View>
      {facts[factIndex] ? (
        <View pointerEvents="none" style={styles.factOverlay}>
          <TravelFactCard fact={facts[factIndex]} />
        </View>
      ) : null}
    </View>
  );
}

function FlightResultSkeleton() {
  const opacity = useRef(new Animated.Value(0.48)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.9, duration: 950, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.48, duration: 950, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [opacity]);
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <Animated.View style={[styles.skeletonBlock, styles.skeletonLogo, { opacity }]} />
        <Animated.View style={[styles.skeletonBlock, styles.skeletonPrice, { opacity }]} />
      </View>
      <Animated.View style={[styles.skeletonBlock, styles.skeletonRoute, { opacity }]} />
      <Animated.View style={[styles.skeletonBlock, styles.skeletonMeta, { opacity }]} />
      <Animated.View style={[styles.skeletonBlock, styles.skeletonAction, { opacity }]} />
    </View>
  );
}

function TravelFactCard({ fact }: { fact: TravelFactResponseDto }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const currentFactId = useRef(fact.id);
  const [visibleFact, setVisibleFact] = useState(fact);

  useEffect(() => {
    if (currentFactId.current === fact.id) return;
    currentFactId.current = fact.id;
    const firstHalf = Animated.timing(rotation, {
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    });
    firstHalf.start(({ finished }) => {
      if (!finished) return;
      setVisibleFact(fact);
      rotation.setValue(-1);
      Animated.timing(rotation, {
        duration: 500,
        easing: Easing.inOut(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }).start();
    });
    return () => rotation.stopAnimation();
  }, [fact, rotation]);

  const translateY = rotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [10, 0, -10],
  });
  const opacity = rotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.factCard,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.factIcon}>
        <Lightbulb color={theme.colors.primary} size={22} />
      </View>
      <View style={styles.factContent}>
        <Text style={styles.factText}>{visibleFact.text}</Text>
        {visibleFact.tags.length ? (
          <Text style={styles.factTags}>
            {visibleFact.tags.map(tag => `#${tag}`).join('  ')}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

function FiltersModal({
  initialSection,
  available,
  visible,
  filters,
  onChange,
  onApply,
  onClose,
  onReset,
}: {
  initialSection: FilterSection;
  available?: FlightSearchFiltersResponseDto;
  visible: boolean;
  filters: FlightFilters;
  onChange: (filters: FlightFilters) => void;
  onApply: () => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const airlinesOffset = useRef<number | null>(null);
  const pendingScroll = useRef(false);
  const scrollToSection = () => {
    if (!pendingScroll.current) return;
    const y = initialSection === 'airlines' ? airlinesOffset.current : 0;
    if (y === null) return;
    scrollRef.current?.scrollTo({ y, animated: false });
    pendingScroll.current = false;
  };

  const sorts: CreateFlightSearchRequestDtoSortByEnum[] = [
    'recommended',
    'price',
    'duration',
    'departure',
  ];
  const toggleAirline = (code: string) => {
    const selected = filters.preferredAirlines.includes(code);
    onChange({
      ...filters,
      preferredAirlines: selected
        ? filters.preferredAirlines.filter(value => value !== code)
        : [...filters.preferredAirlines, code],
    });
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => {
        pendingScroll.current = true;
        scrollToSection();
      }}
      transparent
      visible={visible}
    >
      <Pressable onPress={onClose} style={styles.modalBackdrop}>
        <Pressable onPress={() => undefined} style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('search.filters')}</Text>
            <Pressable onPress={onReset}>
              <Text style={styles.reset}>{t('search.resetFilters')}</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollRef}
            onContentSizeChange={scrollToSection}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={styles.modalScroll}
          >
            <Text style={styles.groupTitle}>{t('search.stopsTitle')}</Text>
            <View style={styles.choiceRow}>
              <FilterChoice
                label={t('search.stopsFilter.any')}
                onPress={() => onChange({ ...filters, stops: 'any' })}
                selected={filters.stops === 'any'}
              />
              {available?.stops.map(option => (
                <FilterChoice
                  key={option.value}
                  label={option.label}
                  onPress={() => onChange({ ...filters, stops: option.value })}
                  selected={filters.stops === option.value}
                />
              ))}
            </View>

            <Text style={styles.groupTitle}>{t('search.priceTitle')}</Text>
            {available?.price.min && available.price.max ? (
              <Text style={styles.rangeHint}>
                {t('search.availablePriceRange', {
                  min: available.price.minFormatted ?? '—',
                  max: available.price.maxFormatted ?? '—',
                })}
              </Text>
            ) : null}
            <View style={styles.inputRow}>
              <FilterInput
                label={t('search.priceFrom')}
                onChangeText={value =>
                  onChange({ ...filters, minPrice: value })
                }
                value={filters.minPrice}
              />
              <FilterInput
                label={t('search.priceTo')}
                onChangeText={value =>
                  onChange({ ...filters, maxPrice: value })
                }
                value={filters.maxPrice}
              />
            </View>

            <Text style={styles.groupTitle}>{t('search.durationTitle')}</Text>
            {available &&
            available.duration.minMinutes !== null &&
            available.duration.maxMinutes !== null ? (
              <Text style={styles.rangeHint}>
                {t('search.availableDurationRange', {
                  min: Math.ceil(available.duration.minMinutes / 60),
                  max: Math.ceil(available.duration.maxMinutes / 60),
                })}
              </Text>
            ) : null}
            <View style={styles.inputRow}>
              <FilterInput
                label={t('search.durationMaximum')}
                onChangeText={value =>
                  onChange({ ...filters, maxDurationHours: value })
                }
                value={filters.maxDurationHours}
              />
            </View>

            {available?.airlines.length ? (
              <>
                <Text
                  onLayout={event => {
                    airlinesOffset.current = event.nativeEvent.layout.y;
                    scrollToSection();
                  }}
                  style={styles.groupTitle}
                >
                  {t('search.airlinesTitle')}
                </Text>
                <View style={styles.airlineList}>
                  {available.airlines.map(airline => (
                    <AirlineFilterOption
                      code={airline.code}
                      key={airline.code}
                      name={airline.name}
                      onPress={() => toggleAirline(airline.code)}
                      selected={filters.preferredAirlines.includes(
                        airline.code,
                      )}
                    />
                  ))}
                </View>
              </>
            ) : null}

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: filters.baggageRequired }}
              onPress={() =>
                onChange({
                  ...filters,
                  baggageRequired: !filters.baggageRequired,
                })
              }
              style={styles.checkboxRow}
            >
              <View
                style={[
                  styles.checkbox,
                  filters.baggageRequired && styles.checkboxSelected,
                ]}
              >
                {filters.baggageRequired ? (
                  <Check color={theme.colors.white} size={15} />
                ) : null}
              </View>
              <Text style={styles.checkboxLabel}>
                {t('search.withBaggage')}
              </Text>
            </Pressable>

            <Text style={styles.groupTitle}>{t('search.sortTitle')}</Text>
            <View style={styles.sortChoices}>
              {sorts.map(value => (
                <FilterChoice
                  key={value}
                  label={t(`search.sort.${value}`)}
                  onPress={() => onChange({ ...filters, sortBy: value })}
                  selected={filters.sortBy === value}
                />
              ))}
            </View>
          </ScrollView>

          <PrimaryButton onPress={onApply} title={t('common.apply')} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function AirlineFilterOption({
  code,
  name,
  selected,
  onPress,
}: {
  code: string;
  name: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.airlineOption}
    >
      <View style={styles.airlineMark}>
        <Text style={styles.airlineMarkText}>{code.slice(0, 2)}</Text>
      </View>
      <View style={styles.airlineInfo}>
        <Text numberOfLines={1} style={styles.airlineName}>
          {name}
        </Text>
        <Text style={styles.airlineCode}>{code}</Text>
      </View>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? <Check color={theme.colors.white} size={15} /> : null}
      </View>
    </Pressable>
  );
}

function FilterInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <TextInput
      accessibilityLabel={label}
      keyboardType="decimal-pad"
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor={theme.colors.textSecondary}
      style={styles.filterInput}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.sizes.contentPadding,
  },
  resultsHeader: { marginBottom: theme.spacing.xl },
  quickFilters: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  swapFilter: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 44,
    position: 'relative',
  },
  quickFilter: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm,
  },
  quickFilterText: {
    ...typography.bodySmall,
    color: theme.colors.textStrong,
    fontFamily: theme.fonts.medium,
    fontWeight: theme.fonts.weights.medium,
  },
  filterIconBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    height: 18,
    justifyContent: 'center',
    minWidth: 18,
    position: 'absolute',
    right: 1,
    top: 1,
  },
  filterIconBadgeText: {
    ...typography.caption,
    color: theme.colors.white,
  },
  state: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.sizes.contentPadding,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingState: {
    alignSelf: 'stretch',
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  skeletonList: {
    alignItems: 'stretch',
    gap: theme.spacing.md,
    padding: theme.sizes.contentPadding,
    width: '100%',
  },
  skeletonCard: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    minHeight: 176,
    width: '100%',
  },
  skeletonHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.lg },
  skeletonBlock: { backgroundColor: theme.colors.border, borderRadius: theme.radii.sm },
  skeletonLogo: { height: 28, width: 90 },
  skeletonPrice: { height: 24, width: 110 },
  skeletonRoute: { height: 48, marginBottom: theme.spacing.md, width: '100%' },
  skeletonMeta: { height: 16, marginBottom: theme.spacing.md, width: '62%' },
  skeletonAction: { alignSelf: 'flex-end', height: 36, width: 120 },
  factOverlay: { alignItems: 'center', justifyContent: 'center', ...StyleSheet.absoluteFill, padding: theme.sizes.contentPadding },
  factCard: {
    ...theme.shadows.card,
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    flexDirection: 'row',
    maxWidth: 520,
    padding: theme.spacing.lg,
    width: '100%',
  },
  factIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 44,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 44,
  },
  factContent: {
    flex: 1,
  },
  factLabel: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  factText: {
    ...typography.body,
  },
  factTags: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  stateText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingMore: {
    ...typography.bodySmall,
    paddingVertical: theme.spacing.lg,
    textAlign: 'center',
  },
  filterButton: {
    position: 'relative',
  },
  filterBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    minWidth: 16,
    position: 'absolute',
    right: -7,
    top: -7,
  },
  filterBadgeText: {
    ...typography.caption,
    color: theme.colors.white,
  },
  modalBackdrop: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    padding: theme.sizes.contentPadding,
    height: '90%',
  },
  modalHandle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    height: 4,
    marginBottom: theme.spacing.md,
    width: 42,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    ...typography.titleSmall,
  },
  reset: {
    ...typography.bodySmall,
    color: theme.colors.primary,
  },
  groupTitle: {
    ...typography.bodySemibold,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  modalContent: {
    paddingBottom: theme.spacing.md,
  },
  modalScroll: { flex: 1 },
  rangeHint: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterInput: {
    ...typography.body,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  airlineList: { gap: theme.spacing.xs },
  airlineOption: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 58,
    paddingVertical: theme.spacing.xs,
  },
  airlineMark: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 36,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 36,
  },
  airlineMarkText: {
    ...typography.caption,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },
  airlineInfo: { flex: 1 },
  airlineName: { ...typography.bodySemibold, color: theme.colors.textStrong },
  airlineCode: { ...typography.caption, color: theme.colors.textSecondary },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 24,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxLabel: {
    ...typography.body,
  },
  sortChoices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
});
