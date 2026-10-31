import { Injectable } from '@nestjs/common';
import type { EmailNotificationRequest } from '../../application/email-notification.types';
import type { EmailSenderPort } from '../../application/email-sender.port';
import { AppLogger } from '@core/logging/app-logger';

@Injectable()
export class DevelopmentEmailSender implements EmailSenderPort {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(DevelopmentEmailSender.name);
  }

  send(request: EmailNotificationRequest): Promise<void> {
    this.logger.info(
      {
        eventId: request.eventId,
        template: request.template,
        orderId: request.variables.orderId,
      },
      'Email delivery simulated; configure a provider adapter',
    );
    return Promise.resolve();
  }
}
