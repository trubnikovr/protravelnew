export interface StoredDocumentProperties {
  storageKey: string;
  mimeType: string;
  size: number;
}

export class StoredDocument {
  private constructor(private readonly properties: StoredDocumentProperties) {}

  static create(properties: StoredDocumentProperties): StoredDocument {
    if (!/^[a-f0-9-]+\.[a-z0-9]+$/.test(properties.storageKey)) {
      throw new Error('Invalid stored document key');
    }
    return new StoredDocument(properties);
  }

  get storageKey() {
    return this.properties.storageKey;
  }
  get mimeType() {
    return this.properties.mimeType;
  }
  get size() {
    return this.properties.size;
  }
}
