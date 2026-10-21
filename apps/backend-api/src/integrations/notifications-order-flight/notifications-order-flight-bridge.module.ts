import { Module } from '@nestjs/common';
import { OrderFlightModule } from '@modules/order-flight';
import { FLIGHT_ORDER_NOTIFICATION_CONTEXT } from '@core/submodules/notifications/application/flight-order-notification-context.port';
import { OrderFlightNotificationContextAdapter } from './order-flight-notification-context.adapter';

@Module({
  imports: [OrderFlightModule],
  providers: [
    OrderFlightNotificationContextAdapter,
    {
      provide: FLIGHT_ORDER_NOTIFICATION_CONTEXT,
      useExisting: OrderFlightNotificationContextAdapter,
    },
  ],
  exports: [FLIGHT_ORDER_NOTIFICATION_CONTEXT],
})
export class NotificationsOrderFlightBridgeModule {}
