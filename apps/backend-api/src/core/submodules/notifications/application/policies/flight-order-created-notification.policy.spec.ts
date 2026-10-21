import type { FlightOrderCreatedEventV1 } from '@shared/events';
import type { EmailNotificationQueuePort } from '../email-notification-queue.port';
import type { FlightOrderNotificationContextPort } from '../flight-order-notification-context.port';
import { NotificationRequestService } from '../notification-request.service';
import { FlightOrderCreatedNotificationPolicy } from './flight-order-created-notification.policy';

describe('FlightOrderCreatedNotificationPolicy', () => {
  it('queues one idempotent email request from the order contact snapshot', async () => {
    const enqueue = jest.fn().mockResolvedValue(undefined);
    const queue: EmailNotificationQueuePort = { enqueue };
    const service = new NotificationRequestService(queue);
    const get = jest.fn().mockResolvedValue({
      orderId: 'order-id',
      customerId: 'customer-id',
      contact: { email: 'customer@example.com', name: 'Customer' },
    });
    const contexts: FlightOrderNotificationContextPort = { get };
    const policy = new FlightOrderCreatedNotificationPolicy(service, contexts);
    const event: FlightOrderCreatedEventV1 = {
      eventId: 'event-id',
      name: 'flight-order.created.v1',
      version: 1,
      aggregateId: 'order-id',
      occurredAt: new Date(),
      payload: { customerId: 'customer-id' },
    };

    await policy.handle(event);

    expect(get).toHaveBeenCalledWith('customer-id', 'order-id');
    expect(enqueue).toHaveBeenCalledWith({
      eventId: event.eventId,
      recipient: { email: 'customer@example.com', name: 'Customer' },
      template: 'flight-order-created',
      variables: { orderId: 'order-id' },
    });
  });
});
