import { Injectable } from '@nestjs/common';
import type { TourForBookingContract } from '@shared/contracts';
import { GetTourForBookingUseCase } from '@modules/tours';
import type { TourForBookingReaderPort } from '@modules/order-tour/application/tour-for-booking-reader.port';

@Injectable()
export class TourForBookingAdapter implements TourForBookingReaderPort {
  constructor(private readonly getTour: GetTourForBookingUseCase) {}

  get(
    tourId: string,
    departureDate: string | null,
    travelersCount: number,
  ): Promise<TourForBookingContract | null> {
    return this.getTour.execute(tourId, departureDate, travelersCount);
  }
}
