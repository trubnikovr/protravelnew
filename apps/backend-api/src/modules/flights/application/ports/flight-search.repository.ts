import type { FlightOffer, FlightSearch } from '../../domain';

export const FLIGHT_SEARCH_REPOSITORY = Symbol('FLIGHT_SEARCH_REPOSITORY');

export interface FlightSearchRepository {
  saveSearch(search: FlightSearch): Promise<void>;
  findSearch(id: string): Promise<FlightSearch | null>;
  saveOffers(searchId: string, offers: FlightOffer[]): Promise<void>;
  findOffers(searchId: string): Promise<FlightOffer[]>;
  findOffer(id: string): Promise<FlightOffer | null>;
}
