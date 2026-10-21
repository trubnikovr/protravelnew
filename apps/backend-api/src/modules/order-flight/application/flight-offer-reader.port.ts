import type { FlightOfferForOrderContract } from '@shared/contracts';

export const FLIGHT_OFFER_READER = Symbol('FLIGHT_OFFER_READER');

export interface FlightOfferReaderPort {
  get(offerId: string): Promise<FlightOfferForOrderContract | null>;
  revalidate(offerId: string): Promise<FlightOfferForOrderContract | null>;
}
