import { Module } from '@nestjs/common';
import { CustomerAuthModule } from '@modules/customer-auth';
import { OrderTourModule } from '@modules/order-tour';
import { CustomerTourBookingsController } from './customer-tour-bookings.controller';

@Module({
  imports: [CustomerAuthModule, OrderTourModule],
  controllers: [CustomerTourBookingsController],
})
export class CustomerTourBookingsEntrypointModule {}
