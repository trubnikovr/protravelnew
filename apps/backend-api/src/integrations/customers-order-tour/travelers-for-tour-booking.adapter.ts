import { Injectable } from '@nestjs/common';
import type { TravelerForTourBookingContract } from '@shared/contracts';
import { CustomerTravelersService } from '@modules/customers/submodules/customer-travelers';
import type { TravelersForTourBookingReaderPort } from '@modules/order-tour/application/travelers-for-tour-booking-reader.port';

@Injectable()
export class TravelersForTourBookingAdapter implements TravelersForTourBookingReaderPort {
  constructor(private readonly travelers: CustomerTravelersService) {}

  get(
    customerId: string,
    travelerIds: string[],
  ): Promise<TravelerForTourBookingContract[]> {
    return this.travelers.getTourBookingTravelers(customerId, travelerIds);
  }
}
