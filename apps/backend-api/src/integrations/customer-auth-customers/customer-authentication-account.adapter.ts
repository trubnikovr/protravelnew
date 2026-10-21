import { Injectable } from '@nestjs/common';
import type { CustomerAuthenticationContract } from '@shared/contracts';
import {
  FindOrCreateCustomerForAuthenticationUseCase,
  GetCustomerForAuthenticationUseCase,
} from '@modules/customers';
import type { CustomerAuthenticationAccountPort } from '@modules/customer-auth/application/customer-authentication-account.port';

@Injectable()
export class CustomerAuthenticationAccountAdapter
  implements CustomerAuthenticationAccountPort
{
  constructor(
    private readonly findOrCreate: FindOrCreateCustomerForAuthenticationUseCase,
    private readonly getCustomer: GetCustomerForAuthenticationUseCase,
  ) {}

  findOrCreateByPhone(phone: string): Promise<CustomerAuthenticationContract> {
    return this.findOrCreate.execute(phone);
  }

  getById(customerId: string): Promise<CustomerAuthenticationContract> {
    return this.getCustomer.execute(customerId);
  }
}
