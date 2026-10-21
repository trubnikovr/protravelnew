import type { CustomerForTourBookingContract } from '@shared/contracts';
import type { CustomerRecord } from '../../infrastructure/persistence/customer.schema';

export class CustomerForTourBookingContractMapper {
  static toContract(customer: CustomerRecord): CustomerForTourBookingContract {
    return {
      id: customer.id,
      name: [customer.firstName, customer.lastName].filter(Boolean).join(' '),
      phone: customer.phone,
      email: customer.email,
    };
  }
}
