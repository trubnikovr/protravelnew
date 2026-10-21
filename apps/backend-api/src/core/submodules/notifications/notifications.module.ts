import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NotificationsOrderFlightBridgeModule } from '@app/integrations/notifications-order-flight/notifications-order-flight-bridge.module';
import { EMAIL_NOTIFICATION_QUEUE } from './application/email-notification-queue.port';
import { EMAIL_SENDER } from './application/email-sender.port';
import { NotificationRequestService } from './application/notification-request.service';
import { FlightOrderCreatedNotificationPolicy } from './application/policies/flight-order-created-notification.policy';
import { DevelopmentEmailSender } from './infrastructure/email/development-email.sender';
import {
  BullEmailNotificationQueue,
  EMAIL_NOTIFICATION_QUEUE_NAME,
  EmailNotificationProcessor,
} from './infrastructure/queue/bull-email-notification.queue';
import { NotificationPayloadCipherService } from './infrastructure/queue/notification-payload-cipher.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: EMAIL_NOTIFICATION_QUEUE_NAME }),
    NotificationsOrderFlightBridgeModule,
  ],
  providers: [
    NotificationRequestService,
    FlightOrderCreatedNotificationPolicy,
    BullEmailNotificationQueue,
    EmailNotificationProcessor,
    NotificationPayloadCipherService,
    DevelopmentEmailSender,
    {
      provide: EMAIL_NOTIFICATION_QUEUE,
      useExisting: BullEmailNotificationQueue,
    },
    { provide: EMAIL_SENDER, useExisting: DevelopmentEmailSender },
  ],
})
export class NotificationsModule {}
