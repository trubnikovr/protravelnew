export interface StoredImageProperties {
  filename: string;
  mimeType: string;
  size: number;
}

export class StoredImage {
  private constructor(private readonly properties: StoredImageProperties) {}

  static create(properties: StoredImageProperties): StoredImage {
    if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(properties.filename)) {
      throw new Error('Invalid stored image filename');
    }
    return new StoredImage(properties);
  }

  get filename(): string {
    return this.properties.filename;
  }
  get mimeType(): string {
    return this.properties.mimeType;
  }
  get size(): number {
    return this.properties.size;
  }
}
