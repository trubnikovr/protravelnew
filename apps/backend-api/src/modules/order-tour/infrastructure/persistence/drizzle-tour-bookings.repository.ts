import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import type {
  AddTourBookingDocumentData,
  BookingTravelerData,
  PersistTourBookingData,
  TourBookingListFilter,
  TourBookingListResult,
  TourBookingsRepository,
} from '../../application/tour-bookings.repository';
import type { TourBooking } from '../../domain/tour-booking';
import type {
  TourBookingDocument,
  TourBookingStatus,
} from '../../domain/tour-booking.types';
import { TourBookingPersistenceMapper } from './tour-booking-persistence.mapper';
import {
  tourBookingDocuments,
  tourBookingTravelers,
  tourBookings,
  type TourBookingRecord,
} from './tour-booking.schema';

@Injectable()
export class DrizzleTourBookingsRepository implements TourBookingsRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async saveTraveler(bookingId: string, travelerId: string | null, data: BookingTravelerData): Promise<'saved' | 'full' | 'not_found'> {
    return this.database.transaction(async (tx) => {
      const [booking] = await tx.select().from(tourBookings).where(eq(tourBookings.id, bookingId)).for('update');
      if (!booking) return 'not_found';
      if (travelerId) {
        const updated = await tx.update(tourBookingTravelers).set(data).where(and(eq(tourBookingTravelers.bookingId, bookingId), eq(tourBookingTravelers.id, travelerId))).returning({ id: tourBookingTravelers.id });
        return updated.length ? 'saved' : 'not_found';
      }
      const [total] = await tx.select({ value: count() }).from(tourBookingTravelers).where(eq(tourBookingTravelers.bookingId, bookingId));
      if (total.value >= booking.travelersCount) return 'full';
      await tx.insert(tourBookingTravelers).values({ bookingId, ...data });
      return 'saved';
    });
  }

  async create(data: PersistTourBookingData): Promise<TourBooking> {
    const bookingId = await this.database.transaction(async (transaction) => {
      const [booking] = await transaction
        .insert(tourBookings)
        .values({
          bookingNumber: this.bookingNumber(),
          customerId: data.customerId,
          tourId: data.tourId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          tourTitle: data.tourTitle,
          travelersCount: data.travelersCount,
          departureDate: data.departureDate,
          totalAmount: data.totalAmount,
          currency: data.currency,
          notes: data.notes,
        })
        .returning({ id: tourBookings.id });
      if (data.travelers.length) {
        await transaction.insert(tourBookingTravelers).values(
          data.travelers.map((traveler) => ({
            bookingId: booking.id,
            travelerId: traveler.travelerId,
            firstName: traveler.firstName,
            lastName: traveler.lastName,
            middleName: traveler.middleName,
            gender: traveler.gender,
            birthDate: traveler.birthDate,
            citizenshipCountryCode: traveler.citizenshipCountryCode,
          })),
        );
      }
      return booking.id;
    });
    return (await this.findById(bookingId))!;
  }

  async findById(id: string): Promise<TourBooking | null> {
    const [booking] = await this.database
      .select()
      .from(tourBookings)
      .where(eq(tourBookings.id, id))
      .limit(1);
    return booking ? this.load(booking) : null;
  }

  async list(filter: TourBookingListFilter): Promise<TourBookingListResult> {
    const where = this.where(filter);
    const [total] = await this.database
      .select({ value: count() })
      .from(tourBookings)
      .where(where);
    const rows = await this.database
      .select({ booking: tourBookings })
      .from(tourBookings)
      .where(where)
      .orderBy(
        filter.sortDirection === 'asc'
          ? asc(tourBookings.createdAt)
          : desc(tourBookings.createdAt),
      )
      .limit(filter.limit)
      .offset((filter.page - 1) * filter.limit);
    return {
      items: await Promise.all(
        rows.map(
          ({ booking }) => this.findById(booking.id) as Promise<TourBooking>,
        ),
      ),
      total: total.value,
    };
  }

  async updateStatus(
    id: string,
    status: TourBookingStatus,
    paidAt: Date | null,
  ): Promise<TourBooking | null> {
    const updated = await this.database
      .update(tourBookings)
      .set({ status, paidAt, updatedAt: new Date() })
      .where(eq(tourBookings.id, id))
      .returning({ id: tourBookings.id });
    return updated.length ? this.findById(id) : null;
  }

  async addDocument(
    bookingId: string,
    data: AddTourBookingDocumentData,
  ): Promise<TourBookingDocument> {
    const [record] = await this.database
      .insert(tourBookingDocuments)
      .values({ bookingId, ...data })
      .returning();
    return TourBookingPersistenceMapper.document(record);
  }

  async findDocument(
    bookingId: string,
    documentId: string,
  ): Promise<TourBookingDocument | null> {
    const [record] = await this.database
      .select()
      .from(tourBookingDocuments)
      .where(
        and(
          eq(tourBookingDocuments.bookingId, bookingId),
          eq(tourBookingDocuments.id, documentId),
        ),
      )
      .limit(1);
    return record ? TourBookingPersistenceMapper.document(record) : null;
  }

  async deleteDocument(
    bookingId: string,
    documentId: string,
  ): Promise<TourBookingDocument | null> {
    const [record] = await this.database
      .delete(tourBookingDocuments)
      .where(
        and(
          eq(tourBookingDocuments.bookingId, bookingId),
          eq(tourBookingDocuments.id, documentId),
        ),
      )
      .returning();
    return record ? TourBookingPersistenceMapper.document(record) : null;
  }

  private async load(booking: TourBookingRecord) {
    const [documents, travelers] = await Promise.all([
      this.database
        .select()
        .from(tourBookingDocuments)
        .where(eq(tourBookingDocuments.bookingId, booking.id))
        .orderBy(desc(tourBookingDocuments.createdAt)),
      this.database
        .select()
        .from(tourBookingTravelers)
        .where(eq(tourBookingTravelers.bookingId, booking.id))
        .orderBy(asc(tourBookingTravelers.createdAt)),
    ]);
    return TourBookingPersistenceMapper.toDomain({
      booking,
      tourTitle: booking.tourTitle,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      documents,
      travelers,
    });
  }

  private where(filter: TourBookingListFilter): SQL | undefined {
    const conditions: SQL[] = [];
    if (filter.status) conditions.push(eq(tourBookings.status, filter.status));
    if (filter.customerId)
      conditions.push(eq(tourBookings.customerId, filter.customerId));
    if (filter.search) {
      const pattern = `%${filter.search}%`;
      const match = or(
        ilike(tourBookings.bookingNumber, pattern),
        ilike(tourBookings.tourTitle, pattern),
        ilike(tourBookings.customerName, pattern),
        ilike(tourBookings.customerEmail, pattern),
      );
      if (match) conditions.push(match);
    }
    return conditions.length ? and(...conditions) : undefined;
  }

  private bookingNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    return `PT-${date}-${randomUUID().slice(0, 8).toUpperCase()}`;
  }
}
