import type { DateTimeValueObject } from '@shared/domain/value-objects';

export enum TourBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface TourBookingDocument {
  id: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  uploadedByAdminId: string;
  createdAt: DateTimeValueObject;
  updatedAt: DateTimeValueObject;
}

export interface TourBookingDisplay {
  tourTitle: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
}

export interface TourBookingTraveler {
  id: string;
  travelerId: string | null;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: 'male' | 'female' | 'unspecified';
  birthDate: string | null;
  citizenshipCountryCode: string | null;
}
