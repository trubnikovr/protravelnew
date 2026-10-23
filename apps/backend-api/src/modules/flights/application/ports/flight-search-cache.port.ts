import type { FlightOfferData } from '../../domain';

export const FLIGHT_SEARCH_CACHE = Symbol('FLIGHT_SEARCH_CACHE');

export interface FlightSearchCachePort {
  get(key: string): Promise<FlightOfferData[] | null>;
  set(
    key: string,
    offers: FlightOfferData[],
    ttlSeconds: number,
  ): Promise<void>;
}
