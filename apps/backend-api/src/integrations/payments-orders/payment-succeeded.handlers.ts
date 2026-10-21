import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { PaymentSucceededEventV1 } from '@shared/events';
import { TourBookingStatus, TourBookingsService } from '@modules/order-tour';
import { UpdateFlightOrderPaymentStatusUseCase } from '@modules/order-flight';

@Injectable()
export class PaymentSucceededHandlers {
  constructor(
    private readonly tours: TourBookingsService,
    private readonly flights: UpdateFlightOrderPaymentStatusUseCase,
  ) {}

  @OnEvent('payment.succeeded.v1')
  async handle(event: PaymentSucceededEventV1): Promise<void> {
    if (event.payload.payableType === 'tour_booking') {
      await this.tours.changeStatus(
        event.payload.payableId,
        TourBookingStatus.PAID,
      );
      return;
    }
    await this.flights.markPaid(event.payload.payableId);
  }
}
