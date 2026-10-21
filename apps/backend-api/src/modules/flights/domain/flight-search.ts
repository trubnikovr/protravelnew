import { DomainEntity } from '@shared/domain/entities';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import type { FlightSearchCriteria } from './flight.types';
import { FlightSearchStatus } from './flight.types';

interface FlightSearchProperties {
  id: EntityIdValueObject;
  createdAt: DateTimeValueObject;
  updatedAt: DateTimeValueObject;
  criteria: FlightSearchCriteria;
  status: FlightSearchStatus;
  progress: number;
  errorCode: string | null;
  expiresAt: DateTimeValueObject;
}

export class FlightSearch extends DomainEntity<FlightSearchProperties> {
  static create(
    criteria: FlightSearchCriteria,
    ttlSeconds: number,
  ): FlightSearch {
    const now = new Date();
    return new FlightSearch({
      id: EntityIdValueObject.create(),
      createdAt: DateTimeValueObject.fromDate(now),
      updatedAt: DateTimeValueObject.fromDate(now),
      criteria,
      status: FlightSearchStatus.CREATED,
      progress: 0,
      errorCode: null,
      expiresAt: DateTimeValueObject.fromDate(
        new Date(now.getTime() + ttlSeconds * 1_000),
      ),
    });
  }

  get criteria(): FlightSearchCriteria {
    return this.entityProperties.criteria;
  }
  get status(): FlightSearchStatus {
    return this.entityProperties.status;
  }
  get progress(): number {
    return this.entityProperties.progress;
  }
  get errorCode(): string | null {
    return this.entityProperties.errorCode;
  }
  get expiresAt(): DateTimeValueObject {
    return this.entityProperties.expiresAt;
  }

  markRunning(): void {
    this.entityProperties.status = FlightSearchStatus.RUNNING;
    this.entityProperties.progress = 20;
    this.touch();
  }

  complete(partial = false): void {
    this.entityProperties.status = partial
      ? FlightSearchStatus.PARTIAL
      : FlightSearchStatus.COMPLETED;
    this.entityProperties.progress = 100;
    this.touch();
  }

  fail(code: string): void {
    this.entityProperties.status = FlightSearchStatus.FAILED;
    this.entityProperties.progress = 100;
    this.entityProperties.errorCode = code;
    this.touch();
  }

  private touch(): void {
    this.entityProperties.updatedAt = DateTimeValueObject.now();
  }
}
