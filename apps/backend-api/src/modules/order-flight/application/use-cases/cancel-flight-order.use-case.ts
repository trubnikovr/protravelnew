import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import type { FlightOrder } from '../../domain/flight-order';
import { FlightOrderCancelledDomainEvent } from '../../domain/flight-order.events';
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
export class CancelFlightOrderUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
    @Inject(FLIGHT_BOOKING_PROVIDER)
    private readonly provider: FlightBookingProviderPort,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(customerId: string, orderId: string): Promise<FlightOrder> {
    const order = await this.requireOrder(customerId, orderId);
    const token = this.requireBookingToken(order);
    const result = await this.provider.cancel(token);

    order.cancel(result.providerStatus);
    await this.orders.save(order);
    this.publishCancelled(order, result.providerStatus);
    return order;
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
      message: 'Only a booked order can be cancelled',
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

  private publishCancelled(order: FlightOrder, providerStatus: string): void {
    this.events.publish(
      new FlightOrderCancelledDomainEvent(order.id.toString(), {
        providerStatus,
      }),
    );
  }
}
