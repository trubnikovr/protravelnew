import { Injectable, NotFoundException } from '@nestjs/common';
import type { CustomerForTourBookingContract } from '@shared/contracts';
import { CustomerStatus } from '../../domain/customer.types';
import { CustomersService } from '../../customers.service';
import { CustomerForTourBookingContractMapper } from '../mappers/customer-for-tour-booking-contract.mapper';

@Injectable()
export class GetCustomerForTourBookingUseCase {
  constructor(private readonly customers: CustomersService) {}

  async execute(
    customerId: string,
  ): Promise<CustomerForTourBookingContract | null> {
    try {
      const customer = await this.customers.findById(customerId);
      if (customer.status !== CustomerStatus.ACTIVE) return null;
      return CustomerForTourBookingContractMapper.toContract(customer);
    } catch (error) {
      if (error instanceof NotFoundException) return null;
      throw error;
    }
  }
}
