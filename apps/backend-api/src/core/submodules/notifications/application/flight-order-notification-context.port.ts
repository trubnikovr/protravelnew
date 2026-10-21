import type { FlightOrderNotificationContextContract } from '@shared/contracts';

export const FLIGHT_ORDER_NOTIFICATION_CONTEXT = Symbol(
  'FLIGHT_ORDER_NOTIFICATION_CONTEXT',
);

export interface FlightOrderNotificationContextPort {
  get(
    customerId: string,
    orderId: string,
  ): Promise<FlightOrderNotificationContextContract | null>;
}
