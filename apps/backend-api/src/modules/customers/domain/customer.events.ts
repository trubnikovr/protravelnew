import { DomainEvent } from '@core/events/domain-event';
import type {
  CustomerCreatedEventV1,
  CustomerDeletedEventV1,
  CustomerStatusChangedEventV1,
  CustomerUpdatedEventV1,
} from '@shared/events';
import type { CustomerStatusContract } from '@shared/contracts';

export class CustomerCreatedDomainEvent
  extends DomainEvent<Record<string, never>>
  implements CustomerCreatedEventV1
{
  readonly name = 'customer.created.v1';
  readonly version = 1;
}

export class CustomerUpdatedDomainEvent
  extends DomainEvent<Record<string, never>>
  implements CustomerUpdatedEventV1
{
  readonly name = 'customer.updated.v1';
  readonly version = 1;
}

export class CustomerDeletedDomainEvent
  extends DomainEvent<Record<string, never>>
  implements CustomerDeletedEventV1
{
  readonly name = 'customer.deleted.v1';
  readonly version = 1;
}

export class CustomerStatusChangedDomainEvent
  extends DomainEvent<{
    status: CustomerStatusContract;
  }>
  implements CustomerStatusChangedEventV1
{
  readonly name = 'customer.status-changed.v1';
  readonly version = 1;
}
