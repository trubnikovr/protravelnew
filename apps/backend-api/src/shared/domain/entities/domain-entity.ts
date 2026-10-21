import type {
  DateTimeValueObject,
  EntityIdValueObject,
} from '../value-objects';

export interface DomainEntityProperties {
  id: EntityIdValueObject;
  createdAt: DateTimeValueObject;
  updatedAt: DateTimeValueObject;
}

export abstract class DomainEntity<
  Properties extends DomainEntityProperties = DomainEntityProperties,
> {
  protected constructor(protected readonly entityProperties: Properties) {}

  get id(): EntityIdValueObject {
    return this.entityProperties.id;
  }

  get createdAt(): DateTimeValueObject {
    return this.entityProperties.createdAt;
  }

  get updatedAt(): DateTimeValueObject {
    return this.entityProperties.updatedAt;
  }
}
