import { Module } from '@nestjs/common';
import { OrderFlightModule } from '@modules/order-flight';
import { CustomerAuthModule } from '@modules/customer-auth';
import { FlightOrdersController } from './flight-orders.controller';
@Module({
  imports: [CustomerAuthModule, OrderFlightModule],
  controllers: [FlightOrdersController],
})
export class OrderFlightEntrypointModule {}
