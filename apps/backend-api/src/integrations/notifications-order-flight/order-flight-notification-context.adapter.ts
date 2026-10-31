import { Injectable } from '@nestjs/common';
import type { FlightOrderNotificationContextContract } from '@shared/contracts';
import { GetFlightOrderNotificationContextUseCase } from '@modules/order-flight';
import type { FlightOrderNotificationContextPort } from '@core/submodules/notifications/application/flight-order-notification-context.port';

@Injectable()
export class OrderFlightNotificationContextAdapter implements FlightOrderNotificationContextPort {
  constructor(
    private readonly getContext: GetFlightOrderNotificationContextUseCase,
  ) {}

  get(
    customerId: string,
    orderId: string,
  ): Promise<FlightOrderNotificationContextContract | null> {
    return this.getContext.execute(customerId, orderId);
  }
}
