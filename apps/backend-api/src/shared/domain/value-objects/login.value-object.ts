const LOGIN_PATTERN = /^[a-z][a-z0-9._-]{2,79}$/;

export class LoginValueObject {
  private constructor(private readonly value: string) {}

  static create(value: string): LoginValueObject {
    const normalized = value.trim().toLowerCase();
    if (!LOGIN_PATTERN.test(normalized)) {
      throw new Error('Login value is invalid');
    }
    return new LoginValueObject(normalized);
  }

  toString(): string {
    return this.value;
  }

  equals(other: LoginValueObject): boolean {
    return this.value === other.value;
  }
}
