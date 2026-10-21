import {
  DateTimeValueObject,
  EntityIdValueObject,
  LocalDateValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import { TourBooking } from '../../domain/tour-booking';
import type {
  TourBookingDocumentRecord,
  TourBookingRecord,
  TourBookingTravelerRecord,
} from './tour-booking.schema';

export interface TourBookingRecordBundle {
  booking: TourBookingRecord;
  tourTitle: string;
  customerName: string;
  customerEmail: string | null;
  documents: TourBookingDocumentRecord[];
  travelers: TourBookingTravelerRecord[];
}

export class TourBookingPersistenceMapper {
  static toDomain(bundle: TourBookingRecordBundle): TourBooking {
    const { booking } = bundle;
    return TourBooking.restore({
      id: EntityIdValueObject.fromString(booking.id),
      createdAt: DateTimeValueObject.fromDate(booking.createdAt),
      updatedAt: DateTimeValueObject.fromDate(booking.updatedAt),
      bookingNumber: booking.bookingNumber,
      customerId: booking.customerId,
      tourId: booking.tourId,
      status: booking.status,
      travelersCount: booking.travelersCount,
      departureDate: booking.departureDate
        ? LocalDateValueObject.create(booking.departureDate)
        : null,
      totalPrice: MoneyValueObject.create(
        booking.totalAmount,
        booking.currency,
      ),
      notes: booking.notes,
      paidAt: booking.paidAt
        ? DateTimeValueObject.fromDate(booking.paidAt)
        : null,
      display: {
        tourTitle: bundle.tourTitle,
        customerName: bundle.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: bundle.customerEmail,
      },
      documents: bundle.documents.map((record) => this.document(record)),
      travelers: bundle.travelers.map((record) => ({
        id: record.id,
        travelerId: record.travelerId,
        firstName: record.firstName,
        lastName: record.lastName,
        middleName: record.middleName,
        gender: record.gender,
        birthDate: record.birthDate,
        citizenshipCountryCode: record.citizenshipCountryCode,
      })),
    });
  }

  static document(record: TourBookingDocumentRecord) {
    return {
      id: record.id,
      originalName: record.originalName,
      storageKey: record.storageKey,
      mimeType: record.mimeType,
      size: record.size,
      uploadedByAdminId: record.uploadedByAdminId,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    };
  }
}
