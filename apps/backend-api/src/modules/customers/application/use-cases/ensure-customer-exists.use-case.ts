import { Injectable } from '@nestjs/common';
import { CustomersService } from '../../customers.service';

@Injectable()
export class EnsureCustomerExistsUseCase {
  constructor(private readonly customers: CustomersService) {}

  async execute(customerId: string): Promise<void> {
    await this.customers.findById(customerId);
  }
}
