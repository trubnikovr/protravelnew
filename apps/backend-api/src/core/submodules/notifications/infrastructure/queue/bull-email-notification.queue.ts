import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import type { Job, Queue } from 'bullmq';
import type { EmailNotificationQueuePort } from '../../application/email-notification-queue.port';
import type { EmailNotificationRequest } from '../../application/email-notification.types';
import {
  EMAIL_SENDER,
  type EmailSenderPort,
} from '../../application/email-sender.port';
import {
  type EncryptedEmailNotificationPayload,
  NotificationPayloadCipherService,
} from './notification-payload-cipher.service';

export const EMAIL_NOTIFICATION_QUEUE_NAME = 'email-notifications';

interface EncryptedEmailNotificationJob {
  eventId: string;
  template: EmailNotificationRequest['template'];
  payload: EncryptedEmailNotificationPayload;
}

@Injectable()
export class BullEmailNotificationQueue implements EmailNotificationQueuePort {
  constructor(
    @InjectQueue(EMAIL_NOTIFICATION_QUEUE_NAME) private readonly queue: Queue,
    private readonly cipher: NotificationPayloadCipherService,
  ) {}

  async enqueue(request: EmailNotificationRequest): Promise<void> {
    const job: EncryptedEmailNotificationJob = {
      eventId: request.eventId,
      template: request.template,
      payload: this.cipher.encrypt(request),
    };
    await this.queue.add(request.template, job, { jobId: request.eventId });
  }
}

@Processor(EMAIL_NOTIFICATION_QUEUE_NAME)
export class EmailNotificationProcessor extends WorkerHost {
  constructor(
    @Inject(EMAIL_SENDER) private readonly emailSender: EmailSenderPort,
    private readonly cipher: NotificationPayloadCipherService,
  ) {
    super();
  }

  async process(job: Job<EncryptedEmailNotificationJob>): Promise<void> {
    await this.emailSender.send(this.cipher.decrypt(job.data.payload));
  }
}
