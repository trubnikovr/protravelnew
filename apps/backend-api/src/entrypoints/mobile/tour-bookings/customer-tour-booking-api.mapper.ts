import type { TourBooking } from '@modules/order-tour';
import type { CustomerTourBookingResponseDto } from './dto/customer-tour-booking.response.dto';

export class CustomerTourBookingApiMapper {
  static toResponse(booking: TourBooking): CustomerTourBookingResponseDto {
    return {
      id: booking.id.toString(),
      bookingNumber: booking.bookingNumber,
      tourId: booking.tourId,
      tourTitle: booking.display.tourTitle,
      status: booking.status,
      travelersCount: booking.travelersCount,
      departureDate: booking.departureDate?.toString() ?? null,
      totalPrice: {
        amount: booking.totalPrice.amount,
        currency: booking.totalPrice.currency,
        formatted: booking.totalPrice.formatWhole(),
      },
      notes: booking.notes,
      travelers: booking.travelers,
      createdAt: booking.createdAt.toString(),
      updatedAt: booking.updatedAt.toString(),
    };
  }
}
