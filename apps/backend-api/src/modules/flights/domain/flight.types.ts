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

export interface FlightRouteLeg {
  origin: string;
  destination: string;
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
  maxDurationMinutes?: number;
  minPrice?: string;
  maxPrice?: string;
  sortBy: FlightSortBy;
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
  groupToken: string;
  itineraries: Array<{
    itineraryToken: string;
    flightToken: string;
    segmentTokens: string[];
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
