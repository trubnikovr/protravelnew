import { Module } from '@nestjs/common';
import { CustomerTravelersModule } from '@modules/customers/submodules/customer-travelers';
import { CustomerAuthModule } from '@modules/customer-auth';
import { CustomerTravelersController } from './customer-travelers.controller';

@Module({
  imports: [CustomerAuthModule, CustomerTravelersModule],
  controllers: [CustomerTravelersController],
})
export class CustomerTravelersEntrypointModule {}
