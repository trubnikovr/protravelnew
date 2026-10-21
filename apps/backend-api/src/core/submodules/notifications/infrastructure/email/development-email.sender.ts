import { Injectable, Logger } from '@nestjs/common';
import type { EmailNotificationRequest } from '../../application/email-notification.types';
import type { EmailSenderPort } from '../../application/email-sender.port';

@Injectable()
export class DevelopmentEmailSender implements EmailSenderPort {
  private readonly logger = new Logger(DevelopmentEmailSender.name);

  send(request: EmailNotificationRequest): Promise<void> {
    this.logger.log({
      message: 'Email delivery simulated; configure a provider adapter',
      eventId: request.eventId,
      template: request.template,
      orderId: request.variables.orderId,
    });
    return Promise.resolve();
  }
}
