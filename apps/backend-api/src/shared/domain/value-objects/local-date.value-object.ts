import { Temporal } from '@js-temporal/polyfill';

export class LocalDateValueObject {
  private constructor(private readonly value: Temporal.PlainDate) {}

  static create(value: string): LocalDateValueObject {
    try {
      return new LocalDateValueObject(Temporal.PlainDate.from(value));
    } catch {
      throw new Error('Local date is invalid');
    }
  }

  isBefore(other: LocalDateValueObject): boolean {
    return Temporal.PlainDate.compare(this.value, other.value) < 0;
  }

  toString(): string {
    return this.value.toString();
  }
}
