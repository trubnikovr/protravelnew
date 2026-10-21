const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class LocalDateValueObject {
  private constructor(private readonly value: string) {}

  static create(value: string): LocalDateValueObject {
    if (!LOCAL_DATE_PATTERN.test(value))
      throw new Error('Local date is invalid');
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error('Local date is invalid');
    }
    return new LocalDateValueObject(value);
  }

  toString(): string {
    return this.value;
  }
}
