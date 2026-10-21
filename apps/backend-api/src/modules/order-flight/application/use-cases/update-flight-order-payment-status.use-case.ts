import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';

@Injectable()
export class UpdateFlightOrderPaymentStatusUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
  ) {}

  async startPayment(id: string): Promise<void> {
    const order = await this.get(id);
    try {
      order.startPayment();
    } catch (error) {
      this.invalid(error);
    }
    await this.orders.save(order);
  }

  async markPaid(id: string): Promise<void> {
    const order = await this.get(id);
    try {
      order.markPaid();
    } catch (error) {
      this.invalid(error);
    }
    await this.orders.save(order);
  }

  private async get(id: string) {
    const order = await this.orders.findByOrderId(id);
    if (!order) {
      throw new NotFoundException({
        code: 'FLIGHT_ORDER_NOT_FOUND',
        message: 'Flight order not found',
      });
    }
    return order;
  }

  private invalid(error: unknown): never {
    throw new ConflictException({
      code: 'FLIGHT_ORDER_PAYMENT_STATUS_INVALID',
      message: error instanceof Error ? error.message : 'Invalid status',
    });
  }
}
