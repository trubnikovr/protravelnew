import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import { CustomerTravelersService } from '@modules/customers/submodules/customer-travelers';
import type { FlightOrder } from '../../domain/flight-order';
import {
  FlightOrderBookedDomainEvent,
  FlightOrderBookingFailedDomainEvent,
} from '../../domain/flight-order.events';
import {
  FLIGHT_BOOKING_PROVIDER,
  type FlightBookingProviderPort,
} from '../flight-booking-provider.port';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';

@Injectable()
export class BookFlightOrderUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
    @Inject(FLIGHT_BOOKING_PROVIDER)
    private readonly provider: FlightBookingProviderPort,
    private readonly travelers: CustomerTravelersService,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(customerId: string, orderId: string): Promise<FlightOrder> {
    const order = await this.requireOrder(customerId, orderId);
    this.startBooking(order);
    await this.orders.save(order);
    return this.performBooking(customerId, order);
  }

  private async performBooking(
    customerId: string,
    order: FlightOrder,
  ): Promise<FlightOrder> {
    try {
      const result = await this.bookWithProvider(customerId, order);
      return await this.confirmBooking(order, result);
    } catch (error) {
      await this.failBooking(order);
      throw error;
    }
  }

  private async bookWithProvider(customerId: string, order: FlightOrder) {
    const passengers = await this.getPassengers(customerId, order);
    return this.provider.book(order.offerSnapshot, passengers, order.contact);
  }

  private getPassengers(customerId: string, order: FlightOrder) {
    return this.travelers.getBookingSnapshots(customerId, [...order.travelers]);
  }

  private async confirmBooking(
    order: FlightOrder,
    result: Parameters<FlightOrder['confirm']>[0],
  ): Promise<FlightOrder> {
    order.confirm(result);
    await this.orders.save(order);
    this.events.publish(
      new FlightOrderBookedDomainEvent(order.id.toString(), {
        recordLocator: order.recordLocator,
      }),
    );
    return order;
  }

  private async failBooking(order: FlightOrder): Promise<void> {
    order.fail('FLIGHT_BOOKING_FAILED');
    await this.orders.save(order);
    this.events.publish(
      new FlightOrderBookingFailedDomainEvent(order.id.toString(), {
        code: order.failureCode,
      }),
    );
  }

  private startBooking(order: FlightOrder): void {
    try {
      order.startBooking();
    } catch {
      throw new ConflictException({
        code: 'FLIGHT_ORDER_INVALID_STATUS',
        message: 'Flight order cannot be booked in its current status',
      });
    }
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
