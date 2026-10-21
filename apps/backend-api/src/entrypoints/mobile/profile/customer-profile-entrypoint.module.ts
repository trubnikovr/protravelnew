import { Module } from '@nestjs/common';
import { CustomerAuthModule } from '@modules/customer-auth';
import { CustomersModule } from '@modules/customers';
import { CustomerProfileController } from './customer-profile.controller';

@Module({
  imports: [CustomerAuthModule, CustomersModule],
  controllers: [CustomerProfileController],
})
export class CustomerProfileEntrypointModule {}
