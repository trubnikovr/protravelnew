import type { CustomerStatusContract } from '@shared/contracts';
import {
  CustomerCreatedDomainEvent,
  CustomerDeletedDomainEvent,
  CustomerStatusChangedDomainEvent,
  CustomerUpdatedDomainEvent,
} from '../../domain/customer.events';

export class CustomerEventMapper {
  static toCreated(customerId: string): CustomerCreatedDomainEvent {
    return new CustomerCreatedDomainEvent(customerId, {});
  }

  static toUpdated(customerId: string): CustomerUpdatedDomainEvent {
    return new CustomerUpdatedDomainEvent(customerId, {});
  }

  static toDeleted(customerId: string): CustomerDeletedDomainEvent {
    return new CustomerDeletedDomainEvent(customerId, {});
  }

  static toStatusChanged(
    customerId: string,
    status: CustomerStatusContract,
  ): CustomerStatusChangedDomainEvent {
    return new CustomerStatusChangedDomainEvent(customerId, { status });
  }
}
