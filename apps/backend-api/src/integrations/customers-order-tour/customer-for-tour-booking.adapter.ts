import { Injectable } from '@nestjs/common';
import type { CustomerForTourBookingContract } from '@shared/contracts';
import { GetCustomerForTourBookingUseCase } from '@modules/customers';
import type { CustomerForTourBookingReaderPort } from '@modules/order-tour/application/customer-for-tour-booking-reader.port';

@Injectable()
export class CustomerForTourBookingAdapter
  implements CustomerForTourBookingReaderPort
{
  constructor(private readonly getCustomer: GetCustomerForTourBookingUseCase) {}

  get(customerId: string): Promise<CustomerForTourBookingContract | null> {
    return this.getCustomer.execute(customerId);
  }
}
