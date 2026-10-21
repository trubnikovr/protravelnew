import { DomainEvent } from '@core/events/domain-event';

export class TravelerCreatedDomainEvent extends DomainEvent<{
  customerId: string;
}> {
  readonly name = 'traveler.created';
}
export class TravelerUpdatedDomainEvent extends DomainEvent<{
  customerId: string;
}> {
  readonly name = 'traveler.updated';
}
export class TravelerDeletedDomainEvent extends DomainEvent<{
  customerId: string;
}> {
  readonly name = 'traveler.deleted';
}
export class TravelerDocumentCreatedDomainEvent extends DomainEvent<{
  customerId: string;
  travelerId: string;
}> {
  readonly name = 'traveler.document.created';
}
export class TravelerDocumentUpdatedDomainEvent extends DomainEvent<{
  customerId: string;
  travelerId: string;
}> {
  readonly name = 'traveler.document.updated';
}
export class TravelerDocumentDeletedDomainEvent extends DomainEvent<{
  customerId: string;
  travelerId: string;
}> {
  readonly name = 'traveler.document.deleted';
}
