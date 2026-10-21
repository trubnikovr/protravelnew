import type { TravelerForTourBookingContract } from '@shared/contracts';

export const TRAVELERS_FOR_TOUR_BOOKING_READER = Symbol(
  'TRAVELERS_FOR_TOUR_BOOKING_READER',
);

export interface TravelersForTourBookingReaderPort {
  get(
    customerId: string,
    travelerIds: string[],
  ): Promise<TravelerForTourBookingContract[]>;
}
