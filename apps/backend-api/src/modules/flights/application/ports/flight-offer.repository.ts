import type { FlightOffer } from '../../domain';

export const FLIGHT_OFFER_REPOSITORY = Symbol('FLIGHT_OFFER_REPOSITORY');

export interface FlightOfferRepository {
  save(offers: FlightOffer[]): Promise<void>;
  findOffer(id: string): Promise<FlightOffer | null>;
  deleteExpired(now: Date): Promise<number>;
}
