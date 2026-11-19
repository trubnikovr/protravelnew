import type { TourBooking, TourBookingDocument } from '@modules/order-tour';
import type { TourBookingDocumentResponseDto } from './dto/response/tour-booking-document.response.dto';
import type { TourBookingResponseDto } from './dto/response/tour-booking.response.dto';

export class TourBookingApiMapper {
  static toResponse(booking: TourBooking): TourBookingResponseDto {
    const id = booking.id.toString();
    return {
      id,
      bookingNumber: booking.bookingNumber,
      customerId: booking.customerId,
      customerName: booking.display.customerName,
      customerPhone: booking.display.customerPhone,
      customerEmail: booking.display.customerEmail,
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
      paidAt: booking.paidAt?.toString() ?? null,
      documents: booking.documents.map((document) =>
        this.document(id, document),
      ),
      travelers: booking.travelers,
      createdAt: booking.createdAt.toString(),
      updatedAt: booking.updatedAt.toString(),
    };
  }

  static document(
    bookingId: string,
    document: TourBookingDocument,
  ): TourBookingDocumentResponseDto {
    return {
      id: document.id,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      uploadedByAdminId: document.uploadedByAdminId,
      downloadUrl: `/api/v1/admin/tour-bookings/${bookingId}/documents/${document.id}/download`,
      createdAt: document.createdAt.toString(),
      updatedAt: document.updatedAt.toString(),
    };
  }
}
