import { Inject, Injectable } from '@nestjs/common';
import type { FlightOrder } from '../../domain/flight-order';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';
@Injectable()
export class GetFlightOrderUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
  ) {}
  execute(customerId: string, id: string): Promise<FlightOrder | null> {
    return this.orders.findById(customerId, id);
  }
}
