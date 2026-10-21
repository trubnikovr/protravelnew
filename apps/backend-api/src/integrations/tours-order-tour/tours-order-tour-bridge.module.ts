import { Module } from '@nestjs/common';
import { ToursModule } from '@modules/tours';
import { TOUR_FOR_BOOKING_READER } from '@modules/order-tour/application/tour-for-booking-reader.port';
import { TourForBookingAdapter } from './tour-for-booking.adapter';

@Module({
  imports: [ToursModule],
  providers: [
    TourForBookingAdapter,
    {
      provide: TOUR_FOR_BOOKING_READER,
      useExisting: TourForBookingAdapter,
    },
  ],
  exports: [TOUR_FOR_BOOKING_READER],
})
export class ToursOrderTourBridgeModule {}
