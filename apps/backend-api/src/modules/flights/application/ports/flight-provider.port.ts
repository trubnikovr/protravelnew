import type {
  FlightOffer,
  FlightSearchCriteria,
  FlightFareRules,
} from '../../domain';
import type { FlightOfferData } from '../../domain/flight.types';

export const FLIGHT_PROVIDER = Symbol('FLIGHT_PROVIDER');

export interface FlightSearchProviderResult {
  offers: FlightOfferData[];
  partial?: boolean;
}

export interface FlightProviderPort {
  readonly name: string;
  search(criteria: FlightSearchCriteria): Promise<FlightSearchProviderResult>;
  getFareRules(offer: FlightOffer): Promise<FlightFareRules>;
}
