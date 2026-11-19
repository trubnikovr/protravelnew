import { Injectable } from '@nestjs/common';
import { CustomersService } from '../../customers.service';
import { CustomerStatus } from '../../domain/customer.types';
import type { Customer } from '../../domain/customer';

@Injectable()
export class GetCustomerForFlightBookingUseCase {
  constructor(private readonly customers: CustomersService) {}

  async execute(customerId: string): Promise<Customer | null> {
    const customer = await this.customers.findById(customerId);
    return customer.status === CustomerStatus.ACTIVE ? this.customers.toDomain(customer) : null;
  }
}
