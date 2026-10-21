import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { EnsureCustomerExistsUseCase } from './application/use-cases/ensure-customer-exists.use-case';
import { FindOrCreateCustomerForAuthenticationUseCase } from './application/use-cases/find-or-create-customer-for-authentication.use-case';
import { GetCustomerForAuthenticationUseCase } from './application/use-cases/get-customer-for-authentication.use-case';
import { GetCustomerForTourBookingUseCase } from './application/use-cases/get-customer-for-tour-booking.use-case';

@Module({
  providers: [
    CustomersService,
    EnsureCustomerExistsUseCase,
    FindOrCreateCustomerForAuthenticationUseCase,
    GetCustomerForAuthenticationUseCase,
    GetCustomerForTourBookingUseCase,
  ],
  exports: [
    CustomersService,
    EnsureCustomerExistsUseCase,
    FindOrCreateCustomerForAuthenticationUseCase,
    GetCustomerForAuthenticationUseCase,
    GetCustomerForTourBookingUseCase,
  ],
})
export class CustomersModule {}
