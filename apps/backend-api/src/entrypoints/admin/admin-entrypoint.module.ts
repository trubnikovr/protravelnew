import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '@modules/admin';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminJwtAuthGuard } from './auth/admin-jwt-auth.guard';
import { AdminJwtStrategy } from './auth/admin-jwt.strategy';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminProfileController } from './profile/admin-profile.controller';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { ToursModule } from '@modules/tours';
import { AdminToursController } from './tours/admin-tours.controller';
import { CustomerTravelersModule } from '@modules/customers/submodules/customer-travelers';
import { AdminCustomerTravelersController } from './customers/admin-customer-travelers.controller';
import { CustomersModule } from '@modules/customers';
import { AdminCustomersController } from './customers/admin-customers.controller';
import { FilesModule } from '@core/submodules/files';
import { AdminFilesController } from './files/admin-files.controller';
import { OrderTourModule } from '@modules/order-tour';
import { AdminTourBookingsController } from './tour-bookings/admin-tour-bookings.controller';
import { ContentModule } from '@modules/content';
import { AdminSystemMessagesController } from './system-messages/admin-system-messages.controller';
import { AdminNewsController } from './news/admin-news.controller';
import { ReferenceModule } from '@core/submodules/reference';
import { AdminFeaturedFlightLocationsController } from './reference/admin-featured-flight-locations.controller';
import { AdminTravelFactsController } from './travel-facts/admin-travel-facts.controller';

@Module({
  imports: [
    AdminModule,
    ToursModule,
    CustomerTravelersModule,
    CustomersModule,
    FilesModule,
    OrderTourModule,
    ContentModule,
    ReferenceModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [
    AdminAuthController,
    AdminProfileController,
    AdminToursController,
    AdminCustomerTravelersController,
    AdminCustomersController,
    AdminFilesController,
    AdminTourBookingsController,
    AdminSystemMessagesController,
    AdminNewsController,
    AdminFeaturedFlightLocationsController,
    AdminTravelFactsController,
  ],
  providers: [
    AdminAuthService,
    AdminJwtStrategy,
    AdminJwtAuthGuard,
    PermissionsGuard,
  ],
})
export class AdminEntrypointModule {}
