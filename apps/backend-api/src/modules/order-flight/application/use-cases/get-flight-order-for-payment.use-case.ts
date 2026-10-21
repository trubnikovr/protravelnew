import { Inject, Injectable } from '@nestjs/common';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';

@Injectable()
export class GetFlightOrderForPaymentUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
  ) {}

  execute(id: string) {
    return this.orders.findByOrderId(id);
  }
}
