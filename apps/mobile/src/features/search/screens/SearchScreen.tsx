import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  MapPin,
  Repeat2,
  UserRound,
} from 'lucide-react-native';
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
import { PrimaryButton } from '../../../shared/ui/PrimaryButton';
import type {
  MainTabParamList,
  SearchStackParamList,
} from '../../../app/navigation/types';
import { theme, typography } from '../../../shared/theme/theme';

type SearchNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<SearchStackParamList, 'SearchForm'>,
  BottomTabNavigationProp<MainTabParamList>
>;

type Place = { code: string; label: string };
type Selector = 'departure' | 'destination' | 'departureDate' | 'returnDate';

const defaultPassengers = {
  adults: 1,
  children: 0,
  infants: 0,
  seatInfants: 0,
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

export function SearchScreen() {
  const navigation = useNavigation<SearchNavigation>();
  const route = useRoute<RouteProp<SearchStackParamList, 'SearchForm'>>();
  const { t } = useTranslation();
  const [departure, setDeparture] = useState<Place>({
    code: 'TAS',
    label: t('common.tashkent'),
  });
  const [destination, setDestination] = useState<Place>({
    code: 'PQC',
    label: t('common.phuQuoc'),
  });
  const availableDates = useMemo(() => dateOptions([7, 14, 21, 28]), []);
  const [departureDate, setDepartureDate] = useState(availableDates[0]);
  const [returnDate, setReturnDate] = useState(availableDates[1]);
  const [selector, setSelector] = useState<Selector | null>(null);

  const passengers = route.params?.passengers ?? defaultPassengers;
  const passengerCount = Object.values(passengers).reduce(
    (total, count) => total + count,
    0,
  );
  const departureOptions: Place[] = [
    { code: 'TAS', label: t('common.tashkent') },
    { code: 'MOW', label: t('common.moscow') },
    { code: 'ALA', label: t('common.almaty') },
  ];
  const destinationOptions: Place[] = [
    { code: 'PQC', label: t('common.phuQuoc') },
    { code: 'AYT', label: t('common.antalya') },
    { code: 'DXB', label: t('common.dubai') },
    { code: 'BAK', label: t('common.baku') },
    { code: 'TBS', label: t('common.tbilisi') },
  ];
  const closeSearch = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Home');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          imageStyle={styles.heroImage}
          source={require('../../../shared/assets/images/travel-hero.png')}
          style={styles.hero}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.topBar}>
            <Pressable
              hitSlop={theme.spacing.md}
              onPress={closeSearch}
              style={styles.backButton}
            >
              <ArrowLeft color={theme.colors.white} size={22} />
            </Pressable>
            <Text style={styles.screenTitle}>{t('search.flights')}</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>
        </ImageBackground>

        <View style={styles.formCard}>
          <>
            <FormRow
              code={departure.code}
              icon={<MapPin color={theme.colors.primary} size={20} />}
              label={t('search.from')}
              onPress={() => setSelector('departure')}
              rightIcon
              value={departure.label}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setDeparture(destination);
                setDestination(departure);
              }}
              style={styles.swapButton}
            >
              <Repeat2 color={theme.colors.primary} size={18} />
            </Pressable>
            <FormRow
              code={destination.code}
              icon={<MapPin color={theme.colors.primary} size={20} />}
              label={t('search.to')}
              onPress={() => setSelector('destination')}
              rightIcon
              value={destination.label}
            />
          </>

          <View style={styles.dateRow}>
            <FormRow
              compact
              icon={<CalendarDays color={theme.colors.primary} size={20} />}
              label={t('search.departureDate')}
              onPress={() => setSelector('departureDate')}
              rightIcon
              value={formatDate(departureDate)}
            />
            <FormRow
              compact
              icon={<CalendarDays color={theme.colors.primary} size={20} />}
              label={t('search.returnDate')}
              onPress={() => setSelector('returnDate')}
              rightIcon
              value={formatDate(returnDate)}
            />
          </View>

          <FormRow
            icon={<UserRound color={theme.colors.primary} size={20} />}
            label={t('common.economy')}
            onPress={() =>
              navigation.navigate('Passengers', {
                passengers,
              })
            }
            rightIcon
            value={t('search.passengerCount', { count: passengerCount })}
          />

          <PrimaryButton
            onPress={() => navigation.navigate('SearchResults')}
            title={t('search.findFlights')}
          />
        </View>
      </ScrollView>
      <SelectionModal
        availableDates={availableDates}
        departureOptions={departureOptions}
        destinationOptions={destinationOptions}
        onClose={() => setSelector(null)}
        onSelectDate={date => {
          if (selector === 'departureDate') {
            setDepartureDate(date);
            if (date >= returnDate) {
              const nextReturn = new Date(date);
              nextReturn.setDate(nextReturn.getDate() + 7);
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
        selector={selector}
      />
    </SafeAreaView>
  );
}

function FormRow({
  label,
  value,
  icon,
  code,
  compact = false,
  rightIcon = false,
  onPress,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  code?: string;
  compact?: boolean;
  rightIcon?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.formRow, compact && styles.compactFormRow]}
    >
      <View style={styles.formIcon}>{icon}</View>
      <View style={styles.formText}>
        <Text style={styles.formLabel}>{label}</Text>
        <Text numberOfLines={1} style={styles.formValue}>
          {value}
        </Text>
      </View>
      {code ? <Text style={styles.code}>{code}</Text> : null}
      {rightIcon ? (
        <ChevronDown color={theme.colors.textSecondary} size={18} />
      ) : null}
    </Pressable>
  );
}

function SelectionModal({
  selector,
  departureOptions,
  destinationOptions,
  availableDates,
  onSelectPlace,
  onSelectDate,
  onClose,
}: {
  selector: Selector | null;
  departureOptions: Place[];
  destinationOptions: Place[];
  availableDates: Date[];
  onSelectPlace: (place: Place) => void;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const places =
    selector === 'departure' ? departureOptions : destinationOptions;
  const isDate = selector === 'departureDate' || selector === 'returnDate';
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
      <Pressable onPress={onClose} style={styles.modalBackdrop}>
        <Pressable onPress={() => undefined} style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          {(isDate ? availableDates : places).map(option => {
            const key =
              option instanceof Date ? option.toISOString() : option.code;
            return (
              <Pressable
                key={key}
                onPress={() =>
                  option instanceof Date
                    ? onSelectDate(option)
                    : onSelectPlace(option)
                }
                style={styles.modalOption}
              >
                <Text style={styles.modalOptionText}>
                  {option instanceof Date ? formatDate(option) : option.label}
                </Text>
                {option instanceof Date ? null : (
                  <Text style={styles.modalOptionCode}>{option.code}</Text>
                )}
              </Pressable>
            );
          })}
          <Pressable onPress={onClose} style={styles.modalCancel}>
            <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
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
  },
  hero: {
    height: 240,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    backgroundColor: theme.colors.overlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.sizes.contentPadding,
    paddingTop: theme.spacing.md,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  backButtonPlaceholder: {
    height: 40,
    width: 40,
  },
  screenTitle: {
    ...typography.title,
    color: theme.colors.white,
  },
  formCard: {
    ...theme.shadows.floating,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    marginHorizontal: theme.sizes.contentPadding,
    marginTop: -62,
    padding: theme.spacing.md,
  },
  formRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 64,
  },
  compactFormRow: {
    flex: 1,
  },
  formIcon: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  formText: {
    flex: 1,
  },
  formLabel: {
    ...typography.caption,
  },
  formValue: {
    ...typography.bodySemibold,
  },
  code: {
    ...typography.bodySemibold,
    color: theme.colors.textSecondary,
  },
  swapButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 34,
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing.md,
    top: 122,
    width: 34,
    zIndex: 2,
  },
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
