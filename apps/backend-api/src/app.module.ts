import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from '@core/core.module';
import { AdminEntrypointModule } from './entrypoints/admin/admin-entrypoint.module';
import { BackendEntrypointModule } from '@entrypoints/backend/backend-entrypoint.module';
import { MobileEntrypointModule } from '@entrypoints/mobile/mobile-entrypoint.module';
import { AuditModule } from './modules/audit/audit.module';
import { ContentModule } from './modules/content/content.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { FilesModule } from './core/submodules/files/files.module';
import { FlightsModule } from './modules/flights/flights.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { NotificationsModule } from './core/submodules/notifications/notifications.module';
import { OrderFlightModule } from '@modules/order-flight';
import { OrderTourModule } from '@modules/order-tour';
import { PaymentsModule } from '@modules/payments';
import { PricingModule } from './modules/pricing/pricing.module';
import { ReferenceModule } from './core/submodules/reference/reference.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SearchModule } from './modules/search/search.module';
import { SupportModule } from './modules/support/support.module';
import { ToursModule } from './modules/tours/tours.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { CustomerTravelersModule } from '@modules/customers/submodules/customer-travelers';
import { CustomersModule } from '@modules/customers';

@Module({
  imports: [
    CoreModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BackendEntrypointModule,
    MobileEntrypointModule,
    CustomersModule,
    CustomerTravelersModule,
    ReferenceModule,
    ContentModule,
    SearchModule,
    FlightsModule,
    HotelsModule,
    ToursModule,
    TransfersModule,
    PricingModule,
    OrderFlightModule,
    OrderTourModule,
    PaymentsModule,
    NotificationsModule,
    FavoritesModule,
    ReviewsModule,
    FilesModule,
    SupportModule,
    AdminEntrypointModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
