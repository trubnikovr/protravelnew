import type { EmailNotificationRequest } from './email-notification.types';

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');

export interface EmailSenderPort {
  send(request: EmailNotificationRequest): Promise<void>;
}
