import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FlightOrder } from '../../domain/flight-order';
import { FlightOrderStatus } from '../../domain/flight-order.types';
import {
  FLIGHT_BOOKING_PROVIDER,
  type FlightBookingProviderPort,
} from '../flight-booking-provider.port';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';

@Injectable()
export class RefreshFlightOrderUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
    @Inject(FLIGHT_BOOKING_PROVIDER)
    private readonly provider: FlightBookingProviderPort,
  ) {}

  async execute(customerId: string, orderId: string): Promise<FlightOrder> {
    const order = await this.requireOrder(customerId, orderId);
    const token = this.requireBookingToken(order);
    const result = await this.provider.refresh(token);

    this.applyProviderResult(order, result);
    await this.orders.save(order);
    return order;
  }

  private applyProviderResult(
    order: FlightOrder,
    result: Parameters<FlightOrder['confirm']>[0],
  ): void {
    if (result.providerStatus === 'CANCELLED') {
      order.cancel(result.providerStatus);
      return;
    }
    order.confirm(result);
  }

  private requireBookingToken(order: FlightOrder): string {
    if (
      order.status === FlightOrderStatus.BOOKED &&
      order.providerBookingToken
    ) {
      return order.providerBookingToken;
    }
    throw new ConflictException({
      code: 'FLIGHT_ORDER_INVALID_STATUS',
      message: 'Only a booked order can be refreshed',
    });
  }

  private async requireOrder(
    customerId: string,
    orderId: string,
  ): Promise<FlightOrder> {
    const order = await this.orders.findById(customerId, orderId);
    if (order) return order;
    throw new NotFoundException({
      code: 'FLIGHT_ORDER_NOT_FOUND',
      message: 'Flight order not found',
    });
  }
}
