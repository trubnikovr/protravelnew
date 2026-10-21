import type { CustomerForTourBookingContract } from '@shared/contracts';

export const CUSTOMER_FOR_TOUR_BOOKING_READER = Symbol(
  'CUSTOMER_FOR_TOUR_BOOKING_READER',
);

export interface CustomerForTourBookingReaderPort {
  get(customerId: string): Promise<CustomerForTourBookingContract | null>;
}
