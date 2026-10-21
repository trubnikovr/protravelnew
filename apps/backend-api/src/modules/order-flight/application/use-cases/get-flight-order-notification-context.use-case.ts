import { Inject, Injectable } from '@nestjs/common';
import type { FlightOrderNotificationContextContract } from '@shared/contracts';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';
import { FlightOrderNotificationContextMapper } from '../mappers/flight-order-notification-context.mapper';

@Injectable()
export class GetFlightOrderNotificationContextUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
  ) {}

  async execute(
    customerId: string,
    orderId: string,
  ): Promise<FlightOrderNotificationContextContract | null> {
    const order = await this.orders.findById(customerId, orderId);
    return order
      ? FlightOrderNotificationContextMapper.toContract(order)
      : null;
  }
}
