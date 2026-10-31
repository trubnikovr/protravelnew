import type { CurrencyCode } from '@shared/domain/enums';
import type { FlightCabinClass } from './flight.types';

export interface FlightShareLocation {
  code: string;
  name: string;
  terminal: string | null;
}

export interface FlightShareSegment {
  carrierCode: string;
  carrierName: string;
  flightNumber: string;
  origin: FlightShareLocation;
  destination: FlightShareLocation;
  departureLocal: string;
  arrivalLocal: string;
  durationMinutes: number;
  cabinClass: FlightCabinClass;
  baggage: string | null;
}

export interface FlightShareSnapshot {
  airlineCode: string;
  airlineName: string;
  totalAmount: string;
  currency: CurrencyCode;
  itineraries: Array<{
    durationMinutes: number;
    segments: FlightShareSegment[];
  }>;
}

export interface FlightShare {
  snapshot: FlightShareSnapshot;
  expiresAt: Date;
}
