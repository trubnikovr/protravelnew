export interface CustomerCreatedEventV1 {
  readonly eventId: string;
  readonly name: 'customer.created.v1';
  readonly version: 1;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: Record<string, never>;
}

export interface CustomerUpdatedEventV1 {
  readonly eventId: string;
  readonly name: 'customer.updated.v1';
  readonly version: 1;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: Record<string, never>;
}

export interface CustomerDeletedEventV1 {
  readonly eventId: string;
  readonly name: 'customer.deleted.v1';
  readonly version: 1;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: Record<string, never>;
}

export interface CustomerStatusChangedEventV1 {
  readonly eventId: string;
  readonly name: 'customer.status-changed.v1';
  readonly version: 1;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: {
    readonly status: CustomerStatusContract;
  };
}
import type { CustomerStatusContract } from '@shared/contracts';
