export class ImageValueObject {
  private constructor(private readonly value: string) {}

  static create(value: string): ImageValueObject {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Image URL protocol is invalid');
    }
    return new ImageValueObject(url.toString());
  }

  toString(): string {
    return this.value;
  }
}
