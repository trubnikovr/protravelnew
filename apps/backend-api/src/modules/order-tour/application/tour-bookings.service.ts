import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CUSTOMER_FOR_TOUR_BOOKING_READER,
  type CustomerForTourBookingReaderPort,
} from './customer-for-tour-booking-reader.port';
import {
  TOUR_FOR_BOOKING_READER,
  type TourForBookingReaderPort,
} from './tour-for-booking-reader.port';
import { TourBookingStatus } from '../domain/tour-booking.types';
import {
  TRAVELERS_FOR_TOUR_BOOKING_READER,
  type TravelersForTourBookingReaderPort,
} from './travelers-for-tour-booking-reader.port';
import {
  TOUR_BOOKINGS_REPOSITORY,
  type AddTourBookingDocumentData,
  type CreateTourBookingData,
  type TourBookingListFilter,
  type TourBookingsRepository,
} from './tour-bookings.repository';

@Injectable()
export class TourBookingsService {
  constructor(
    @Inject(TOUR_BOOKINGS_REPOSITORY)
    private readonly repository: TourBookingsRepository,
    @Inject(CUSTOMER_FOR_TOUR_BOOKING_READER)
    private readonly customers: CustomerForTourBookingReaderPort,
    @Inject(TOUR_FOR_BOOKING_READER)
    private readonly tours: TourForBookingReaderPort,
    @Inject(TRAVELERS_FOR_TOUR_BOOKING_READER)
    private readonly travelers: TravelersForTourBookingReaderPort,
  ) {}

  list(filter: TourBookingListFilter) {
    return this.repository.list(filter);
  }

  async get(id: string) {
    const booking = await this.repository.findById(id);
    if (!booking) this.notFound();
    return booking;
  }

  async create(data: CreateTourBookingData) {
    const travelers = data.travelerIds?.length
      ? await this.travelers.get(data.customerId, data.travelerIds)
      : [];
    const travelersCount = travelers.length || data.travelersCount;
    const [customer, tour] = await Promise.all([
      this.customers.get(data.customerId),
      this.tours.get(data.tourId, data.departureDate, travelersCount),
    ]);
    if (!customer || !tour) {
      throw new BadRequestException({
        code: 'TOUR_BOOKING_REFERENCES_INVALID',
        message: 'Tour, customer, or departure is not available',
      });
    }
    return this.repository.create({
      ...data,
      travelersCount,
      travelers,
      departureDate: tour.departureDate,
      totalAmount: (
        BigInt(tour.price.amount) * BigInt(travelersCount)
      ).toString(),
      currency: tour.price.currency,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      tourTitle: tour.title,
    });
  }

  async listForCustomer(customerId: string, page: number, limit: number) {
    return this.repository.list({
      customerId,
      page,
      limit,
      sortDirection: 'desc',
    });
  }

  async getForCustomer(customerId: string, id: string) {
    const booking = await this.get(id);
    if (booking.customerId !== customerId) this.notFound();
    return booking;
  }

  async changeStatus(id: string, status: TourBookingStatus) {
    const booking = await this.get(id);
    if (booking.status === status) return booking;
    try {
      booking.changeStatus(status);
    } catch (error) {
      throw new ConflictException({
        code: 'TOUR_BOOKING_STATUS_INVALID',
        message: error instanceof Error ? error.message : 'Invalid status',
      });
    }
    const paidAt =
      status === TourBookingStatus.PAID
        ? new Date()
        : booking.paidAt?.toDate() ?? null;
    return (await this.repository.updateStatus(id, status, paidAt))!;
  }

  async addDocument(bookingId: string, data: AddTourBookingDocumentData) {
    await this.get(bookingId);
    return this.repository.addDocument(bookingId, data);
  }

  async getDocument(bookingId: string, documentId: string) {
    const document = await this.repository.findDocument(bookingId, documentId);
    if (!document) this.documentNotFound();
    return document;
  }

  async deleteDocument(bookingId: string, documentId: string) {
    const document = await this.repository.deleteDocument(
      bookingId,
      documentId,
    );
    if (!document) this.documentNotFound();
    return document;
  }

  private notFound(): never {
    throw new NotFoundException({
      code: 'TOUR_BOOKING_NOT_FOUND',
      message: 'Tour booking not found',
    });
  }

  private documentNotFound(): never {
    throw new NotFoundException({
      code: 'TOUR_BOOKING_DOCUMENT_NOT_FOUND',
      message: 'Tour booking document not found',
    });
  }
}
