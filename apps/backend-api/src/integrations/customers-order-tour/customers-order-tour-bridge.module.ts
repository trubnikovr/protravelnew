import { Module } from '@nestjs/common';
import { CustomersModule } from '@modules/customers';
import { CUSTOMER_FOR_TOUR_BOOKING_READER } from '@modules/order-tour/application/customer-for-tour-booking-reader.port';
import { CustomerForTourBookingAdapter } from './customer-for-tour-booking.adapter';
import { CustomerTravelersModule } from '@modules/customers/submodules/customer-travelers';
import { TRAVELERS_FOR_TOUR_BOOKING_READER } from '@modules/order-tour/application/travelers-for-tour-booking-reader.port';
import { TravelersForTourBookingAdapter } from './travelers-for-tour-booking.adapter';

@Module({
  imports: [CustomersModule, CustomerTravelersModule],
  providers: [
    CustomerForTourBookingAdapter,
    TravelersForTourBookingAdapter,
    {
      provide: CUSTOMER_FOR_TOUR_BOOKING_READER,
      useExisting: CustomerForTourBookingAdapter,
    },
    {
      provide: TRAVELERS_FOR_TOUR_BOOKING_READER,
      useExisting: TravelersForTourBookingAdapter,
    },
  ],
  exports: [
    CUSTOMER_FOR_TOUR_BOOKING_READER,
    TRAVELERS_FOR_TOUR_BOOKING_READER,
  ],
})
export class CustomersOrderTourBridgeModule {}
