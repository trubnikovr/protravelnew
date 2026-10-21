export class TimeZoneValueObject {
  private constructor(private readonly value: string) {}

  static create(value: string): TimeZoneValueObject {
    try {
      new Intl.DateTimeFormat('en', { timeZone: value }).format();
      return new TimeZoneValueObject(value);
    } catch {
      throw new Error('Time zone must be a valid IANA identifier');
    }
  }

  toString(): string {
    return this.value;
  }
}
