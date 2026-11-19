import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { FlightOrderCreatedEventV1 } from '@shared/events';
import {
  FLIGHT_ORDER_NOTIFICATION_CONTEXT,
  type FlightOrderNotificationContextPort,
} from '../flight-order-notification-context.port';
import { NotificationRequestService } from '../notification-request.service';

@Injectable()
export class FlightOrderCreatedNotificationPolicy {
  constructor(
    private readonly notifications: NotificationRequestService,
    @Inject(FLIGHT_ORDER_NOTIFICATION_CONTEXT)
    private readonly contexts: FlightOrderNotificationContextPort,
  ) {}

  @OnEvent(
    'flight-order.created.v1' satisfies FlightOrderCreatedEventV1['name'],
  )
  async handle(event: FlightOrderCreatedEventV1): Promise<void> {
    const context = await this.contexts.get(
      event.payload.customerId,
      event.aggregateId,
    );
    if (!context) throw new Error('Flight order notification context missing');
    if (!context.contact.email) return;
    await this.notifications.requestEmail({
      eventId: event.eventId,
      recipient: { ...context.contact, email: context.contact.email },
      template: 'flight-order-created',
      variables: { orderId: event.aggregateId },
    });
  }
}
