import { Inject, Injectable } from '@nestjs/common';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';

@Injectable()
export class ListFlightOrdersUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
  ) {}

  execute(customerId: string, page: number, limit: number) {
    return this.orders.listByCustomer(customerId, page, limit);
  }
}
