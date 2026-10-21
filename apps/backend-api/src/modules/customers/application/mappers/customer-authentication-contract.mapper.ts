import type { CustomerAuthenticationContract } from '@shared/contracts';
import type { CustomerRecord } from '../../infrastructure/persistence/customer.schema';

export class CustomerAuthenticationContractMapper {
  static toContract(record: CustomerRecord): CustomerAuthenticationContract {
    return {
      id: record.id,
      phone: record.phone,
      firstName: record.firstName,
      lastName: record.lastName,
      status: record.status,
    };
  }
}
