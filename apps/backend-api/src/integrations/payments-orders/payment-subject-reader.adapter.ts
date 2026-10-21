import { Injectable } from '@nestjs/common';
import {
  GetFlightOrderForPaymentUseCase,
  FlightOrderStatus,
  UpdateFlightOrderPaymentStatusUseCase,
} from '@modules/order-flight';
import { TourBookingStatus, TourBookingsService } from '@modules/order-tour';
import type {
  PaymentSubjectContract,
  PaymentSubjectReaderPort,
} from '@modules/payments/application/payment-subject-reader.port';
import { PaymentPayableType } from '@modules/payments/domain/payment.types';

@Injectable()
export class PaymentSubjectReaderAdapter implements PaymentSubjectReaderPort {
  constructor(
    private readonly tours: TourBookingsService,
    private readonly getFlight: GetFlightOrderForPaymentUseCase,
    private readonly flightPayment: UpdateFlightOrderPaymentStatusUseCase,
  ) {}

  async get(
    type: PaymentPayableType,
    id: string,
  ): Promise<PaymentSubjectContract | null> {
    if (type === PaymentPayableType.TOUR_BOOKING) {
      const booking = await this.tours.get(id);
      return {
        id,
        type,
        customerId: booking.customerId,
        title: `Оплата тура ${booking.bookingNumber}`,
        amount: booking.totalPrice.amount,
        currency: booking.totalPrice.currency,
        payable: [
          TourBookingStatus.CONFIRMED,
          TourBookingStatus.AWAITING_PAYMENT,
        ].includes(booking.status),
        expiresAt: null,
      };
    }
    const order = await this.getFlight.execute(id);
    if (!order) return null;
    return {
      id,
      type,
      customerId: order.customerId.toString(),
      title: `Оплата авиабилетов ${id}`,
      amount: order.offerSnapshot.totalAmount,
      currency: order.offerSnapshot.currency,
      payable: [
        FlightOrderStatus.BOOKED,
        FlightOrderStatus.PAYMENT_PENDING,
      ].includes(order.status),
      expiresAt: order.bookingExpiresAt?.toISOString() ?? null,
    };
  }

  async startPayment(type: PaymentPayableType, id: string): Promise<void> {
    if (type === PaymentPayableType.TOUR_BOOKING) {
      await this.tours.changeStatus(id, TourBookingStatus.AWAITING_PAYMENT);
      return;
    }
    await this.flightPayment.startPayment(id);
  }
}
