import { Inject, Injectable } from '@nestjs/common';
import {
  EMAIL_NOTIFICATION_QUEUE,
  type EmailNotificationQueuePort,
} from './email-notification-queue.port';
import type { EmailNotificationRequest } from './email-notification.types';

@Injectable()
export class NotificationRequestService {
  constructor(
    @Inject(EMAIL_NOTIFICATION_QUEUE)
    private readonly queue: EmailNotificationQueuePort,
  ) {}

  requestEmail(request: EmailNotificationRequest): Promise<void> {
    return this.queue.enqueue(request);
  }
}
