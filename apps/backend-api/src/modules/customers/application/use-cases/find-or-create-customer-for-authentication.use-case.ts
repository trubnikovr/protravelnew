import { Injectable } from '@nestjs/common';
import type { CustomerAuthenticationContract } from '@shared/contracts';
import { CustomersService } from '../../customers.service';
import { CustomerAuthenticationContractMapper } from '../mappers/customer-authentication-contract.mapper';

@Injectable()
export class FindOrCreateCustomerForAuthenticationUseCase {
  constructor(private readonly customers: CustomersService) {}

  async execute(phone: string): Promise<CustomerAuthenticationContract> {
    const customer = await this.customers.findOrCreateByPhone(phone);
    return CustomerAuthenticationContractMapper.toContract(customer);
  }
}
