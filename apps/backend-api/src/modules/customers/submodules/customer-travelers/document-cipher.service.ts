import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export interface EncryptedDocumentNumber {
  encrypted: string;
  iv: string;
  authTag: string;
  last4: string;
}

@Injectable()
export class DocumentCipherService {
  constructor(private readonly config: ConfigService) {}

  encrypt(value: string): EncryptedDocumentNumber {
    const normalized = value.replace(/\s+/g, '').toUpperCase();
    const key = Buffer.from(
      this.config.getOrThrow<string>('DOCUMENT_ENCRYPTION_KEY'),
      'hex',
    );
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(normalized, 'utf8'),
      cipher.final(),
    ]);
    return {
      encrypted: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      last4: normalized.slice(-4),
    };
  }

  decrypt(value: Omit<EncryptedDocumentNumber, 'last4'>): string {
    const key = Buffer.from(
      this.config.getOrThrow<string>('DOCUMENT_ENCRYPTION_KEY'),
      'hex',
    );
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(value.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(value.authTag, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(value.encrypted, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  }
}
