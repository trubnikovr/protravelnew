import { Module } from '@nestjs/common';
import { FlightsEntrypointModule } from './flights/flights-entrypoint.module';
import { OrderFlightEntrypointModule } from './order-flight/order-flight-entrypoint.module';
import { CustomerTravelersEntrypointModule } from './travelers/customer-travelers-entrypoint.module';
import { ReferenceEntrypointModule } from './reference/reference-entrypoint.module';
import { CustomerAuthEntrypointModule } from './auth/customer-auth-entrypoint.module';
import { CustomerProfileEntrypointModule } from './profile/customer-profile-entrypoint.module';
import { NewsEntrypointModule } from './news/news-entrypoint.module';
import { HomeEntrypointModule } from './home/home-entrypoint.module';
import { SystemMessagesEntrypointModule } from './system-messages/system-messages-entrypoint.module';
import { ToursEntrypointModule } from './tours/tours-entrypoint.module';
import { CustomerTourBookingsEntrypointModule } from './tour-bookings/customer-tour-bookings-entrypoint.module';
import { PaymentsEntrypointModule } from './payments/payments-entrypoint.module';
import { TravelFactsEntrypointModule } from './travel-facts/travel-facts-entrypoint.module';

@Module({
  imports: [
    CustomerAuthEntrypointModule,
    CustomerProfileEntrypointModule,
    FlightsEntrypointModule,
    HomeEntrypointModule,
    NewsEntrypointModule,
    OrderFlightEntrypointModule,
    CustomerTravelersEntrypointModule,
    CustomerTourBookingsEntrypointModule,
    PaymentsEntrypointModule,
    ReferenceEntrypointModule,
    SystemMessagesEntrypointModule,
    ToursEntrypointModule,
    TravelFactsEntrypointModule,
  ],
})
export class MobileEntrypointModule {}
