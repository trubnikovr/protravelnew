import { randomUUID } from 'node:crypto';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class EntityIdValueObject {
  private constructor(private readonly value: string) {}

  static create(): EntityIdValueObject {
    return new EntityIdValueObject(randomUUID());
  }

  static fromString(value: string): EntityIdValueObject {
    if (!UUID_PATTERN.test(value)) {
      throw new Error('Entity id must be a valid UUID');
    }
    return new EntityIdValueObject(value.toLowerCase());
  }

  toString(): string {
    return this.value;
  }

  equals(other: EntityIdValueObject): boolean {
    return this.value === other.value;
  }
}
