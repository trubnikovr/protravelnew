import type { EmailNotificationRequest } from './email-notification.types';

export const EMAIL_NOTIFICATION_QUEUE = Symbol('EMAIL_NOTIFICATION_QUEUE');

export interface EmailNotificationQueuePort {
  enqueue(request: EmailNotificationRequest): Promise<void>;
}
