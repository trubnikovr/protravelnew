import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import type { EmailNotificationRequest } from '../../application/email-notification.types';

export interface EncryptedEmailNotificationPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

@Injectable()
export class NotificationPayloadCipherService {
  constructor(private readonly config: ConfigService) {}

  encrypt(
    request: EmailNotificationRequest,
  ): EncryptedEmailNotificationPayload {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key(), iv);
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(request), 'utf8'),
      cipher.final(),
    ]);
    return {
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
    };
  }

  decrypt(
    payload: EncryptedEmailNotificationPayload,
  ): EmailNotificationRequest {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.key(),
      Buffer.from(payload.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64')),
      decipher.final(),
    ]).toString('utf8');
    return JSON.parse(plaintext) as EmailNotificationRequest;
  }

  private key(): Buffer {
    const dedicated = this.config.get<string>('NOTIFICATION_ENCRYPTION_KEY');
    const value =
      dedicated || this.config.getOrThrow<string>('DOCUMENT_ENCRYPTION_KEY');
    return Buffer.from(value, 'hex');
  }
}
