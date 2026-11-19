import type {
  FlightPassengerTypeContract,
  FlightProviderReferenceContract,
} from '@shared/contracts';
import type { CurrencyCode } from '@shared/domain/enums';

export enum FlightOrderStatus {
  DRAFT = 'draft',
  BOOKING = 'booking',
  BOOKED = 'booked',
  PAYMENT_PENDING = 'payment_pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export interface FlightOrderContact {
  name: string;
  email?: string;
  countryCode: string;
  areaCode: string;
  phone: string;
}

export interface FlightOrderTravelerSelection {
  travelerId: string;
  documentId: string;
  passengerType: FlightPassengerTypeContract;
}

export interface FlightOrderOfferSnapshot {
  carrierCode: string;
  carrierName: string;
  itineraries: unknown[];
  totalAmount: string;
  currency: CurrencyCode;
  offerExpiresAt: string;
  providerReference: FlightProviderReferenceContract;
  passengers: Array<{ type: FlightPassengerTypeContract; count: number }>;
}

export interface FlightBookingResult {
  totalAmount?: string;
  providerBookingToken: string;
  recordLocator: string | null;
  expiresAt: string | null;
  providerStatus: string;
}
