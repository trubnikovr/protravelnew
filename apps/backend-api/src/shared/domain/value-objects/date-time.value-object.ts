export class DateTimeValueObject {
  private constructor(private readonly value: Date) {}

  static now(): DateTimeValueObject {
    return new DateTimeValueObject(new Date());
  }

  static fromDate(value: Date): DateTimeValueObject {
    if (Number.isNaN(value.getTime())) {
      throw new Error('DateTime value must be a valid date');
    }
    return new DateTimeValueObject(new Date(value.getTime()));
  }

  static fromISOString(value: string): DateTimeValueObject {
    return DateTimeValueObject.fromDate(new Date(value));
  }

  toDate(): Date {
    return new Date(this.value.getTime());
  }

  toISOString(): string {
    return this.value.toISOString();
  }

  toString(): string {
    return this.toISOString();
  }

  format(timeZone: string, locale = 'ru-RU'): string {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone,
    }).format(this.value);
  }

  equals(other: DateTimeValueObject): boolean {
    return this.value.getTime() === other.value.getTime();
  }
}
