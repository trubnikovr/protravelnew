import type { TourBooking } from '../domain/tour-booking';
import type {
  TourBookingDocument,
  TourBookingStatus,
} from '../domain/tour-booking.types';
import type { CurrencyCode } from '@shared/domain/enums';
import type { TravelerForTourBookingContract } from '@shared/contracts';

export const TOUR_BOOKINGS_REPOSITORY = Symbol('TOUR_BOOKINGS_REPOSITORY');

export interface CreateTourBookingData {
  customerId: string;
  tourId: string;
  travelersCount: number;
  travelerIds?: string[];
  departureDate: string | null;
  notes: string | null;
}

export interface PersistTourBookingData extends CreateTourBookingData {
  totalAmount: string;
  currency: CurrencyCode;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  tourTitle: string;
  travelers: TravelerForTourBookingContract[];
}

export interface TourBookingListFilter {
  page: number;
  limit: number;
  search?: string;
  status?: TourBookingStatus;
  customerId?: string;
  sortDirection: 'asc' | 'desc';
}

export interface TourBookingListResult {
  items: TourBooking[];
  total: number;
}

export interface AddTourBookingDocumentData {
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  uploadedByAdminId: string;
}

export interface TourBookingsRepository {
  create(data: PersistTourBookingData): Promise<TourBooking>;
  findById(id: string): Promise<TourBooking | null>;
  list(filter: TourBookingListFilter): Promise<TourBookingListResult>;
  updateStatus(
    id: string,
    status: TourBookingStatus,
    paidAt: Date | null,
  ): Promise<TourBooking | null>;
  addDocument(
    bookingId: string,
    data: AddTourBookingDocumentData,
  ): Promise<TourBookingDocument>;
  findDocument(
    bookingId: string,
    documentId: string,
  ): Promise<TourBookingDocument | null>;
  deleteDocument(
    bookingId: string,
    documentId: string,
  ): Promise<TourBookingDocument | null>;
}
