import { DomainEvent } from '@core/events/domain-event';
import type { TourStatus } from './tour.types';

export class TourCreatedDomainEvent extends DomainEvent<{
  status: TourStatus;
}> {
  readonly name = 'tour.created';
}

export class TourUpdatedDomainEvent extends DomainEvent<{
  status: TourStatus;
}> {
  readonly name = 'tour.updated';
}

export class TourDeletedDomainEvent extends DomainEvent<Record<string, never>> {
  readonly name = 'tour.deleted';
}
