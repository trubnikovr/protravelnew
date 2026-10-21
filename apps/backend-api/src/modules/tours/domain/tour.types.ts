import type {
  LocalDateValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';

export enum TourStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum TourType {
  PACKAGE = 'package',
  EXCURSION = 'excursion',
}

export enum TourMealType {
  ROOM_ONLY = 'room_only',
  BREAKFAST = 'breakfast',
  HALF_BOARD = 'half_board',
  FULL_BOARD = 'full_board',
  ALL_INCLUSIVE = 'all_inclusive',
}

export { CurrencyCode as TourCurrency } from '@shared/domain/enums';
export type { CurrencyCode as TourCurrencyCode } from '@shared/domain/enums';

export interface TourContent {
  title: string;
  shortDescription: string;
  description: string;
  inclusions: string[];
  exclusions: string[];
}

export interface TourDestination {
  id?: string;
  position: number;
  countryId: string;
  countryCode?: string | null;
  countryName?: string;
  cityId: string | null;
  cityName?: string | null;
  arrivalAirportId: string | null;
  nights: number | null;
}

export interface TourDeparture {
  id?: string;
  departureDate: LocalDateValueObject;
  returnDate: LocalDateValueObject | null;
  departureCityId: string;
  departureAirportId: string | null;
  arrivalAirportId: string | null;
  price: MoneyValueObject;
  seatsTotal: number | null;
  seatsAvailable: number | null;
}

export interface TourPackageDetails {
  hotelName: string;
  hotelCategory: number | null;
  mealType: TourMealType;
  transferIncluded: boolean;
  insuranceIncluded: boolean;
}

export interface TourExcursionDetails {
  guideLanguage: string;
  groupSizeMax: number | null;
}

export interface TourProgramDay {
  id?: string;
  dayNumber: number;
  title: string;
  description: string;
}
