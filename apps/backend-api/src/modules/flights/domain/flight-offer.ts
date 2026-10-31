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

  static restore(input: {
    id: string;
    searchId: string;
    createdAt: Date;
    updatedAt: Date;
    data: FlightOfferData;
  }): FlightOffer {
    return new FlightOffer({
      ...input.data,
      id: EntityIdValueObject.fromString(input.id),
      searchId: EntityIdValueObject.fromString(input.searchId),
      createdAt: DateTimeValueObject.fromDate(input.createdAt),
      updatedAt: DateTimeValueObject.fromDate(input.updatedAt),
    });
  }

  get searchId(): EntityIdValueObject {
    return this.entityProperties.searchId;
  }
  get data(): FlightOfferData {
    const { id, searchId, createdAt, updatedAt, ...data } =
      this.entityProperties;
    void id;
    void searchId;
    void createdAt;
    void updatedAt;
    return data;
  }
}
