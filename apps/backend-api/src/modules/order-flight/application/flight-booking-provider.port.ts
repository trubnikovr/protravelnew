import type {
  TravelerDocumentType,
  TravelerGender,
} from '@modules/customers/submodules/customer-travelers';
import type {
  FlightBookingResult,
  FlightOrderContact,
  FlightOrderOfferSnapshot,
} from '../domain/flight-order.types';

export const FLIGHT_BOOKING_PROVIDER = Symbol('FLIGHT_BOOKING_PROVIDER');
export interface FlightBookingPassenger {
  passengerType: 'adult' | 'child' | 'infant';
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: TravelerGender;
  birthDate: string;
  citizenshipCountryCode: string;
  document: {
    type: TravelerDocumentType;
    number: string;
    issuingCountryCode: string;
    issuedAt: string | null;
    expiresAt: string | null;
  };
}
export interface FlightBookingProviderPort {
  book(
    offer: FlightOrderOfferSnapshot,
    passengers: FlightBookingPassenger[],
    contact: FlightOrderContact,
  ): Promise<FlightBookingResult>;
  refresh(providerBookingToken: string): Promise<FlightBookingResult>;
  cancel(providerBookingToken: string): Promise<FlightBookingResult>;
}
