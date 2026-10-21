import { Injectable } from '@nestjs/common';
import type { CustomerAuthenticationContract } from '@shared/contracts';
import { CustomersService } from '../../customers.service';
import { CustomerAuthenticationContractMapper } from '../mappers/customer-authentication-contract.mapper';

@Injectable()
export class GetCustomerForAuthenticationUseCase {
  constructor(private readonly customers: CustomersService) {}

  async execute(customerId: string): Promise<CustomerAuthenticationContract> {
    const customer = await this.customers.findById(customerId);
    return CustomerAuthenticationContractMapper.toContract(customer);
  }
}
