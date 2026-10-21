import { Module } from '@nestjs/common';
import { TourBookingsService } from './application/tour-bookings.service';
import { TOUR_BOOKINGS_REPOSITORY } from './application/tour-bookings.repository';
import { DrizzleTourBookingsRepository } from './infrastructure/persistence/drizzle-tour-bookings.repository';
import { CustomersOrderTourBridgeModule } from '@app/integrations/customers-order-tour/customers-order-tour-bridge.module';
import { ToursOrderTourBridgeModule } from '@app/integrations/tours-order-tour/tours-order-tour-bridge.module';

@Module({
  imports: [CustomersOrderTourBridgeModule, ToursOrderTourBridgeModule],
  providers: [
    TourBookingsService,
    {
      provide: TOUR_BOOKINGS_REPOSITORY,
      useClass: DrizzleTourBookingsRepository,
    },
  ],
  exports: [TourBookingsService],
})
export class OrderTourModule {}
