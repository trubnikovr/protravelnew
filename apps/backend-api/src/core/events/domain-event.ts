import { randomUUID } from 'node:crypto';

export abstract class DomainEvent<TPayload extends object> {
  readonly eventId = randomUUID();
  readonly occurredAt = new Date();

  abstract readonly name: string;

  constructor(
    readonly aggregateId: string,
    readonly payload: TPayload,
  ) {}
}
