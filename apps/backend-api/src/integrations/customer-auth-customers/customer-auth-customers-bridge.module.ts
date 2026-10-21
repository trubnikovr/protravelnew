import { Module } from '@nestjs/common';
import { CustomersModule } from '@modules/customers';
import { CUSTOMER_AUTHENTICATION_ACCOUNT } from '@modules/customer-auth/application/customer-authentication-account.port';
import { CustomerAuthenticationAccountAdapter } from './customer-authentication-account.adapter';

@Module({
  imports: [CustomersModule],
  providers: [
    CustomerAuthenticationAccountAdapter,
    {
      provide: CUSTOMER_AUTHENTICATION_ACCOUNT,
      useExisting: CustomerAuthenticationAccountAdapter,
    },
  ],
  exports: [CUSTOMER_AUTHENTICATION_ACCOUNT],
})
export class CustomerAuthCustomersBridgeModule {}
