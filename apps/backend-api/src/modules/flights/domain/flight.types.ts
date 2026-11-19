import type { CurrencyCode } from '@shared/domain/enums';

export enum FlightCabinClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first',
}

export enum FlightPassengerType {
  ADULT = 'adult',
  CHILD = 'child',
  INFANT = 'infant',
}

export enum FlightSortBy {
  RECOMMENDED = 'recommended',
  PRICE = 'price',
  DURATION = 'duration',
  DEPARTURE = 'departure',
}

export enum FlightHighlightType {
  CHEAPEST = 'cheapest',
  FASTEST = 'fastest',
}

export interface FlightRouteLeg {
  origin: string;
  destination: string;
  originAirports?: string[];
  destinationAirports?: string[];
  departureDate: string;
}

export interface FlightPassengerGroup {
  type: FlightPassengerType;
  count: number;
}

export interface FlightSearchCriteria {
  routes: FlightRouteLeg[];
  passengers: FlightPassengerGroup[];
  cabinClass: FlightCabinClass;
  directOnly: boolean;
  baggageRequired: boolean;
  preferredAirlines: string[];
  departureTimeFrom?: string;
  departureTimeTo?: string;
  arrivalTimeFrom?: string;
  arrivalTimeTo?: string;
  maxStops?: number;
  stopsCount?: number;
  maxDurationMinutes?: number;
  minPrice?: string;
  maxPrice?: string;
  sortBy: FlightSortBy;
  page: number;
  limit: number;
}

export interface FlightLocation {
  code: string;
  name: string;
  terminal: string | null;
}

export interface FlightSegment {
  carrierCode: string;
  carrierName: string;
  flightNumber: string;
  origin: FlightLocation;
  destination: FlightLocation;
  departureLocal: string;
  arrivalLocal: string;
  durationMinutes: number;
  cabinClass: FlightCabinClass;
  bookingClass: string | null;
  baggage: string | null;
}

export interface FlightItinerary {
  durationMinutes: number;
  segments: FlightSegment[];
}

export interface FlightFareRules {
  sections: Array<{ code: string; title: string; content: string }>;
}

export interface FlightProviderReference {
  searchToken: string;
  groupToken: string | number;
  itineraries: Array<{
    itineraryToken: string | number;
    flightToken: string | number;
    segmentTokens: Array<string | number>;
  }>;
}

export interface FlightOfferData {
  provider: string;
  validatingCarrierCode: string;
  validatingCarrierName: string;
  itineraries: FlightItinerary[];
  totalAmount: string;
  currency: CurrencyCode;
  electronicTicket: boolean;
  requiresLatinNames: boolean;
  expiresAt: string;
  providerReference: FlightProviderReference;
  passengers: FlightPassengerGroup[];
}

export interface FlightSearchFilters {
  price: { min: string | null; max: string | null; currency: CurrencyCode | null };
  stops: Array<{ value: number; count: number }>;
  airlines: Array<{ code: string; name: string; count: number }>;
  baggage: { included: number; notIncluded: number };
  duration: { minMinutes: number | null; maxMinutes: number | null };
  departureTime: { min: string | null; max: string | null };
}
