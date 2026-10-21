const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailValueObject {
  private constructor(private readonly value: string) {}

  static create(value: string): EmailValueObject {
    const normalized = value.trim().toLowerCase();
    if (normalized.length > 255 || !EMAIL_PATTERN.test(normalized)) {
      throw new Error('Email value is invalid');
    }
    return new EmailValueObject(normalized);
  }

  toString(): string {
    return this.value;
  }

  equals(other: EmailValueObject): boolean {
    return this.value === other.value;
  }
}
