import { useMemo, useState } from 'react';
import {
  useNavigation,
  useRoute,
  type CompositeNavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type {
  MainTabParamList,
  AviaStackParamList,
} from '../../../app/navigation/types';
import {
  dateOptions,
  defaultPassengers,
  toLocalDate,
  type Place,
  type Selector,
  type CabinClass,
  type PassengerSelection,
} from './aviaSearchForm';

type SearchNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<AviaStackParamList, 'AviaSearchForm'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export function useAviaSearchForm() {
  const navigation = useNavigation<SearchNavigation>();
  const route = useRoute<RouteProp<AviaStackParamList, 'AviaSearchForm'>>();
  const { t } = useTranslation();
  const [departure, setDeparture] = useState<Place | null>(
    __DEV__
      ? {
          code: 'SVO',
          label: t('common.sheremetyevo'),
          airportCodes: ['SVO'],
        }
      : null,
  );
  const [destination, setDestination] = useState<Place | null>(
    __DEV__
      ? {
          code: 'IST',
          label: t('common.istanbulAirport'),
          airportCodes: ['IST'],
        }
      : null,
  );
  const initialDates = useMemo(() => dateOptions([0, 14, 15]), []);
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

  const closeSelector = () => setSelector(null);
  const closePassengers = () => setPassengersVisible(false);
  const openDeparture = () => setSelector('departure');
  const openDestination = () => setSelector('destination');
  const openDepartureDate = () => setSelector('departureDate');
  const openReturnDate = () => setSelector('returnDate');
  const openPassengers = () => setPassengersVisible(true);
  const clearDepartureDate = () => setDepartureDate(null);
  const clearReturnDate = () => setReturnDate(null);
  const swapRoute = () => {
    if (!departure || !destination) return;
    setDeparture(destination);
    setDestination(departure);
  };
  const submit = () => {
    if (!departure || !destination || !departureDate) return;
    navigation.navigate('AviaSearchResults', {
      departure,
      destination,
      departureDate: toLocalDate(departureDate),
      returnDate: returnDate ? toLocalDate(returnDate) : undefined,
      passengers,
      cabinClass,
    });
  };
  const selectDate = (date: Date) => {
    if (selector === 'departureDate') {
      setDepartureDate(date);
      if (!returnDate || date >= returnDate) {
        const nextReturn = new Date(date);
        nextReturn.setDate(nextReturn.getDate() + 1);
        setReturnDate(nextReturn);
      }
    } else if (selector === 'returnDate') {
      setReturnDate(date);
    }
    closeSelector();
  };
  const selectPlace = (place: Place) => {
    if (selector === 'departure') setDeparture(place);
    if (selector === 'destination') setDestination(place);
    closeSelector();
  };
  const applyPassengers = (
    nextPassengers: PassengerSelection,
    nextCabinClass: CabinClass,
  ) => {
    setPassengers(nextPassengers);
    setCabinClass(nextCabinClass);
    closePassengers();
  };
  return {
    departure,
    destination,
    departureDate,
    returnDate,
    selector,
    passengers,
    cabinClass,
    passengersVisible,
    passengerCount,
    minimumDate:
      selector === 'returnDate'
        ? departureDate ?? initialDates[0]
        : initialDates[0],
    selectedDate:
      selector === 'returnDate'
        ? returnDate ?? departureDate ?? initialDates[1]
        : departureDate ?? initialDates[1],
    closeSelector,
    closePassengers,
    openDeparture,
    openDestination,
    openDepartureDate,
    openReturnDate,
    openPassengers,
    clearDepartureDate,
    clearReturnDate,
    swapRoute,
    submit,
    selectDate,
    selectPlace,
    applyPassengers,
  };
}
