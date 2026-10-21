import { DomainEntity } from '@shared/domain/entities';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import type { FlightOfferData } from './flight.types';

interface FlightOfferProperties extends FlightOfferData {
  id: EntityIdValueObject;
  createdAt: DateTimeValueObject;
  updatedAt: DateTimeValueObject;
  searchId: EntityIdValueObject;
}

export class FlightOffer extends DomainEntity<FlightOfferProperties> {
  static create(searchId: string, data: FlightOfferData): FlightOffer {
    const now = DateTimeValueObject.now();
    return new FlightOffer({
      ...data,
      id: EntityIdValueObject.create(),
      searchId: EntityIdValueObject.fromString(searchId),
      createdAt: now,
      updatedAt: now,
    });
  }

  get searchId(): EntityIdValueObject {
    return this.entityProperties.searchId;
  }
  get data(): FlightOfferData {
    return this.entityProperties;
  }
}
