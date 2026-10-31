import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import {
  useNavigation,
  useRoute,
  type CompositeNavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppSelectField,
  FilterChoice,
  PrimaryButton,
} from '../../../shared/ui';
import type {
  MainTabParamList,
  SearchStackParamList,
} from '../../../app/navigation/types';
import { theme, typography } from '../../../shared/theme/theme';
import { useFlightPlaceSuggestions } from '../model/useFlightSearch';

type SearchNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<SearchStackParamList, 'SearchForm'>,
  BottomTabNavigationProp<MainTabParamList>
>;

type Place = { code: string; label: string; airportCodes: string[] };
type Selector = 'departure' | 'destination' | 'departureDate' | 'returnDate';
type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';
type PassengerSelection = typeof defaultPassengers;

LocaleConfig.locales.ru = {
  monthNames: [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ],
  monthNamesShort: [
    'янв.',
    'февр.',
    'март',
    'апр.',
    'май',
    'июнь',
    'июль',
    'авг.',
    'сент.',
    'окт.',
    'нояб.',
    'дек.',
  ],
  dayNames: [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

const defaultPassengers = {
  adults: 1,
  children: 0,
  infants: 0,
};

function dateOptions(offsets: number[]): Date[] {
  return offsets.map(offset => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  });
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  }).format(date);
}

function toLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function SearchScreen() {
  const navigation = useNavigation<SearchNavigation>();
  const route = useRoute<RouteProp<SearchStackParamList, 'SearchForm'>>();
  const { t } = useTranslation();
  const [departure, setDeparture] = useState<Place>({
    code: 'MOW',
    label: t('common.moscow'),
    airportCodes: ['SVO', 'DME', 'VKO', 'ZIA'],
  });
  const [destination, setDestination] = useState<Place>({
    code: 'LED',
    label: t('common.saintPetersburg'),
    airportCodes: ['LED'],
  });
  const initialDates = useMemo(() => dateOptions([0, 1, 2]), []);
  const [departureDate, setDepartureDate] = useState<Date | null>(
    initialDates[1],
  );
  const [returnDate, setReturnDate] = useState<Date | null>(initialDates[2]);
  const [selector, setSelector] = useState<Selector | null>(null);
  const [passengers, setPassengers] = useState<PassengerSelection>(
    route.params?.passengers ?? defaultPassengers,
  );
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [passengersVisible, setPassengersVisible] = useState(false);
  const passengerCount = Object.values(passengers).reduce(
    (total, count) => total + count,
    0,
  );
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ImageBackground
        imageStyle={styles.backgroundImage}
        source={require('../../../shared/assets/images/flight-search.png')}
        style={styles.background}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formTopSpacer} />
        <View style={styles.formCard}>
          <View style={styles.routeFields}>
            <AppSelectField
              code={departure.code}
              label={t('search.from')}
              onPress={() => setSelector('departure')}
              value={departure.label}
            />
            <AppSelectField
              code={destination.code}
              label={t('search.to')}
              onPress={() => setSelector('destination')}
              value={destination.label}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('search.swapRoute')}
              onPress={() => {
                setDeparture(destination);
                setDestination(departure);
              }}
              style={styles.swapButton}
            >
              <Image
                source={require('../../../shared/assets/images/swap-directions.png')}
                style={styles.swapIcon}
              />
            </Pressable>
          </View>

          <View style={styles.dateRow}>
            <AppSelectField
              compact
              label={t('search.departureDate')}
              onClear={() => setDepartureDate(null)}
              onPress={() => setSelector('departureDate')}
              rightDivider
              showClear={departureDate !== null}
              value={departureDate ? formatDate(departureDate) : ''}
            />
            <AppSelectField
              compact
              label={t('search.returnDate')}
              onClear={() => setReturnDate(null)}
              onPress={() => setSelector('returnDate')}
              showClear={returnDate !== null}
              value={returnDate ? formatDate(returnDate) : ''}
            />
          </View>

          <AppSelectField
            label={t(`common.${cabinClassLabelKey[cabinClass]}`)}
            onPress={() => setPassengersVisible(true)}
            showChevron
            value={t('search.passengerCount', { count: passengerCount })}
          />
        </View>

        <View style={styles.submitButton}>
          <PrimaryButton
            disabled={!departureDate}
            onPress={() => {
              if (!departureDate) return;
              navigation.navigate('SearchResults', {
                departure,
                destination,
                departureDate: toLocalDate(departureDate),
                returnDate: returnDate ? toLocalDate(returnDate) : undefined,
                passengers,
                cabinClass,
              });
            }}
            title={t('search.findFlights')}
          />
        </View>
      </ScrollView>
      <SelectionModal
        minimumDate={
          selector === 'returnDate'
            ? (departureDate ?? initialDates[0])
            : initialDates[0]
        }
        onClose={() => setSelector(null)}
        onSelectDate={date => {
          if (selector === 'departureDate') {
            setDepartureDate(date);
            if (!returnDate || date >= returnDate) {
              const nextReturn = new Date(date);
              nextReturn.setDate(nextReturn.getDate() + 1);
              setReturnDate(nextReturn);
            }
          } else {
            setReturnDate(date);
          }
          setSelector(null);
        }}
        onSelectPlace={place => {
          if (selector === 'departure') setDeparture(place);
          if (selector === 'destination') setDestination(place);
          setSelector(null);
        }}
        selectedDate={
          selector === 'returnDate'
            ? (returnDate ?? departureDate ?? initialDates[1])
            : (departureDate ?? initialDates[1])
        }
        selector={selector}
      />
      <PassengersSheet
        cabinClass={cabinClass}
        onApply={(nextPassengers, nextCabinClass) => {
          setPassengers(nextPassengers);
          setCabinClass(nextCabinClass);
          setPassengersVisible(false);
        }}
        onClose={() => setPassengersVisible(false)}
        passengers={passengers}
        visible={passengersVisible}
      />
    </SafeAreaView>
  );
}

const cabinClassLabelKey: Record<
  CabinClass,
  'economy' | 'premiumEconomy' | 'business' | 'first'
> = {
  economy: 'economy',
  premium_economy: 'premiumEconomy',
  business: 'business',
  first: 'first',
};

function PassengersSheet({
  visible,
  passengers,
  cabinClass,
  onApply,
  onClose,
}: {
  visible: boolean;
  passengers: PassengerSelection;
  cabinClass: CabinClass;
  onApply: (passengers: PassengerSelection, cabinClass: CabinClass) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [draftPassengers, setDraftPassengers] = useState(passengers);
  const [draftCabinClass, setDraftCabinClass] = useState(cabinClass);
  useEffect(() => {
    if (!visible) return;
    setDraftPassengers(passengers);
    setDraftCabinClass(cabinClass);
  }, [cabinClass, passengers, visible]);
  const passengerRows: Array<{
    id: keyof PassengerSelection;
    label: string;
    hint: string;
  }> = [
    { id: 'adults', label: t('search.adults'), hint: t('search.adultsHint') },
    {
      id: 'children',
      label: t('search.children'),
      hint: t('search.childrenHint'),
    },
    {
      id: 'infants',
      label: t('search.infants'),
      hint: t('search.infantsHint'),
    },
  ];
  const updatePassenger = (id: keyof PassengerSelection, delta: number) => {
    setDraftPassengers(current => ({
      ...current,
      [id]: Math.max(id === 'adults' ? 1 : 0, current[id] + delta),
    }));
  };
  const classes = Object.keys(cabinClassLabelKey) as CabinClass[];
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable onPress={onClose} style={styles.modalBackdrop}>
        <Pressable onPress={() => undefined} style={styles.passengersSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{t('search.passengersTitle')}</Text>
          {passengerRows.map(item => (
            <View key={item.id} style={styles.passengerRow}>
              <View style={styles.passengerText}>
                <Text style={styles.passengerLabel}>{item.label}</Text>
                <Text style={styles.passengerHint}>{item.hint}</Text>
              </View>
              <CounterButton
                disabled={
                  draftPassengers[item.id] <= (item.id === 'adults' ? 1 : 0)
                }
                onPress={() => updatePassenger(item.id, -1)}
                type="minus"
              />
              <Text style={styles.passengerCount}>
                {draftPassengers[item.id]}
              </Text>
              <CounterButton
                onPress={() => updatePassenger(item.id, 1)}
                primary
                type="plus"
              />
            </View>
          ))}
          <Text style={styles.classTitle}>{t('search.serviceClass')}</Text>
          <View style={styles.classOptions}>
            {classes.map(value => {
              const selected = value === draftCabinClass;
              return (
                <FilterChoice
                  key={value}
                  label={t(`common.${cabinClassLabelKey[value]}`)}
                  onPress={() => setDraftCabinClass(value)}
                  selected={selected}
                />
              );
            })}
          </View>
          <PrimaryButton
            onPress={() => onApply(draftPassengers, draftCabinClass)}
            title={t('common.apply')}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CounterButton({
  type,
  onPress,
  primary = false,
  disabled = false,
}: {
  type: 'minus' | 'plus';
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  const Icon = type === 'plus' ? Plus : Minus;
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

function SelectionModal({
  selector,
  selectedDate,
  minimumDate,
  onSelectPlace,
  onSelectDate,
  onClose,
}: {
  selector: Selector | null;
  selectedDate: Date;
  minimumDate: Date;
  onSelectPlace: (place: Place) => void;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const isDate = selector === 'departureDate' || selector === 'returnDate';
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const suggestions = useFlightPlaceSuggestions(debouncedQuery);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);
  useEffect(() => {
    if (selector) {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [selectedDate, selector]);
  const normalizedQuery = debouncedQuery.trim();
  const places = normalizedQuery
    ? (suggestions.data ?? [])
        .filter(item => item.airportCodes.length)
        .map(item => ({
          key: `${item.type}:${item.id}`,
          code: item.code ?? item.airportCodes[0],
          airportCodes: item.airportCodes,
          label: item.name,
          codesLabel: item.airportCodes.join(', '),
        }))
    : [];
  const title = isDate
    ? t('search.selectDate')
    : selector === 'departure'
    ? t('search.selectDeparture')
    : t('search.selectDestination');

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={selector !== null}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalKeyboardView}
      >
        <Pressable onPress={onClose} style={styles.modalBackdrop}>
          <Pressable onPress={() => undefined} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{title}</Text>
            {!isDate ? (
              <TextInput
                autoFocus
                onChangeText={setQuery}
                placeholder={t('search.placeSearchPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.searchInput}
                value={query}
              />
            ) : null}
            {isDate ? (
              <Calendar
                current={toLocalDate(selectedDate)}
                enableSwipeMonths
                firstDay={1}
                hideExtraDays
                key={`${selector}-${toLocalDate(selectedDate)}`}
                markedDates={{
                  [toLocalDate(selectedDate)]: {
                    selected: true,
                    selectedColor: theme.colors.primary,
                    selectedTextColor: theme.colors.white,
                  },
                }}
                minDate={toLocalDate(minimumDate)}
                onDayPress={day =>
                  onSelectDate(new Date(day.year, day.month - 1, day.day))
                }
                style={styles.calendar}
                theme={{
                  arrowColor: theme.colors.primary,
                  calendarBackground: theme.colors.surface,
                  dayTextColor: theme.colors.text,
                  monthTextColor: theme.colors.textStrong,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: theme.colors.white,
                  textDayFontFamily: theme.fonts.regular,
                  textDayFontSize: theme.fontSizes.body,
                  textDayHeaderFontFamily: theme.fonts.medium,
                  textDayHeaderFontSize: theme.fontSizes.caption,
                  textDisabledColor: theme.colors.textMuted,
                  textMonthFontFamily: theme.fonts.semibold,
                  textMonthFontSize: theme.fontSizes.bodyLarge,
                  todayTextColor: theme.colors.primary,
                }}
              />
            ) : null}
            {!isDate ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.placeResults}
              >
                {normalizedQuery && suggestions.isFetching && !places.length ? (
                  <ActivityIndicator
                    color={theme.colors.primary}
                    style={styles.modalState}
                  />
                ) : null}
                {suggestions.isError && !places.length ? (
                  <Text style={styles.modalStateText}>
                    {t('search.placeSearchError')}
                  </Text>
                ) : null}
                {normalizedQuery &&
                !suggestions.isFetching &&
                !suggestions.isError &&
                places.length === 0 ? (
                  <Text style={styles.modalStateText}>
                    {t('search.placeSearchEmpty')}
                  </Text>
                ) : null}
                {places.map(option => (
                  <Pressable
                    key={option.key}
                    onPress={() =>
                      onSelectPlace({
                        code: option.code,
                        label: option.label,
                        airportCodes: option.airportCodes,
                      })
                    }
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>{option.label}</Text>
                    <Text style={styles.modalOptionCode}>
                      {option.codesLabel}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
            <Pressable onPress={onClose} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  formTopSpacer: {
    height: 178,
  },
  formCard: {
    ...theme.shadows.floating,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.sm,
    marginHorizontal: theme.sizes.contentPadding,
    overflow: 'hidden',
  },
  routeFields: {
    position: 'relative',
  },
  swapButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing.sm,
    top: 56,
    width: 38,
    zIndex: 2,
  },
  swapIcon: {
    height: 24,
    width: 24,
  },
  dateRow: {
    flexDirection: 'row',
  },
  submitButton: {
    marginHorizontal: theme.sizes.contentPadding,
    marginTop: theme.spacing.md,
  },
  modalBackdrop: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalKeyboardView: { flex: 1 },
  modalSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    maxHeight: '92%',
    padding: theme.sizes.contentPadding,
  },
  passengersSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    maxHeight: '92%',
    padding: theme.sizes.contentPadding,
    paddingBottom: theme.spacing.xxl,
  },
  passengerRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 68,
  },
  passengerText: { flex: 1 },
  passengerLabel: { ...typography.bodySemibold },
  passengerHint: { ...typography.bodySmall },
  passengerCount: {
    ...typography.bodySemibold,
    minWidth: 38,
    textAlign: 'center',
  },
  counterButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  counterButtonPrimary: { backgroundColor: theme.colors.primary },
  counterButtonDisabled: { opacity: 0.4 },
  classTitle: {
    ...typography.bodySemibold,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  classOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  modalHandle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    height: 4,
    marginBottom: theme.spacing.md,
    width: 42,
  },
  modalTitle: {
    ...typography.titleSmall,
    marginBottom: theme.spacing.sm,
  },
  calendar: { marginBottom: theme.spacing.sm },
  searchInput: {
    ...typography.body,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    minHeight: theme.sizes.inputHeight,
    paddingHorizontal: theme.spacing.md,
  },
  placeResults: { flexShrink: 1 },
  modalState: {
    marginVertical: theme.spacing.md,
  },
  modalStateText: {
    ...typography.bodySmall,
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  modalOption: {
    alignItems: 'center',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 52,
  },
  modalOptionText: {
    ...typography.body,
    flex: 1,
  },
  modalOptionCode: {
    ...typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  modalCancel: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  modalCancelText: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
  },
});
