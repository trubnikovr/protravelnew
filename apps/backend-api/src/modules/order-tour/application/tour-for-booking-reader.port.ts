import type { TourForBookingContract } from '@shared/contracts';

export const TOUR_FOR_BOOKING_READER = Symbol('TOUR_FOR_BOOKING_READER');

export interface TourForBookingReaderPort {
  get(
    tourId: string,
    departureDate: string | null,
    travelersCount: number,
  ): Promise<TourForBookingContract | null>;
}
