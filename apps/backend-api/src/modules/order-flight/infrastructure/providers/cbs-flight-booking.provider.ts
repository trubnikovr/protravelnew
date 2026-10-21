import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CBS_PASSENGER_TYPE_BY_DOMAIN,
  CbsCommand,
  CbsGender,
  CbsPassportType,
} from '@app/integrations/cbs/cbs.constants';
import { createCbsSignature } from '@app/integrations/cbs/cbs-signature';
import {
  TravelerDocumentType,
  TravelerGender,
} from '@modules/customers/submodules/customer-travelers';
import type {
  FlightBookingPassenger,
  FlightBookingProviderPort,
} from '../../application/flight-booking-provider.port';
import type {
  FlightBookingResult,
  FlightOrderContact,
  FlightOrderOfferSnapshot,
} from '../../domain/flight-order.types';

interface CbsBookingResponse {
  respond?: {
    bookingFile?: {
      token?: string;
      status?: string;
      reservations?: {
        reservation?: Array<{ recordLocator?: string; timeLimit?: string }>;
      };
    };
  };
}

interface CbsCredentials {
  agency: string;
  user: string;
  password: string;
}

@Injectable()
export class CbsFlightBookingProvider implements FlightBookingProviderPort {
  constructor(private readonly config: ConfigService) {}

  async book(
    offer: FlightOrderOfferSnapshot,
    passengers: FlightBookingPassenger[],
    contact: FlightOrderContact,
  ): Promise<FlightBookingResult> {
    const parameters = this.bookingParameters(offer, passengers, contact);
    const response = await this.request(
      CbsCommand.CREATE_BOOKING_RELEASE,
      parameters,
    );
    return this.map(response);
  }

  async refresh(providerBookingToken: string): Promise<FlightBookingResult> {
    const response = await this.request(CbsCommand.LOAD_BOOKING, {
      token: providerBookingToken,
    });
    return this.map(response);
  }

  async cancel(providerBookingToken: string): Promise<FlightBookingResult> {
    const response = await this.request(CbsCommand.CANCEL_BOOKING, {
      token: providerBookingToken,
    });
    return this.map(response);
  }

  private bookingParameters(
    offer: FlightOrderOfferSnapshot,
    passengers: FlightBookingPassenger[],
    contact: FlightOrderContact,
  ) {
    return {
      token: offer.providerReference.searchToken,
      flightsGroup: this.flightGroup(offer),
      customer: contact,
      passengers: this.passengers(passengers, contact),
    };
  }

  private flightGroup(offer: FlightOrderOfferSnapshot) {
    const reference = offer.providerReference;
    return {
      flightGroup: [
        {
          token: reference.groupToken,
          itineraries: {
            itinerary: reference.itineraries.map((item) =>
              this.itinerary(item),
            ),
          },
        },
      ],
    };
  }

  private itinerary(
    item: FlightOrderOfferSnapshot['providerReference']['itineraries'][number],
  ) {
    return {
      token: item.itineraryToken,
      flights: { flight: [{ token: item.flightToken }] },
    };
  }

  private passengers(
    passengers: FlightBookingPassenger[],
    contact: FlightOrderContact,
  ) {
    return {
      passenger: passengers.map((item, index) =>
        this.passenger(item, index === 0 ? contact : null),
      ),
    };
  }

  private passenger(
    passenger: FlightBookingPassenger,
    contact: FlightOrderContact | null,
  ) {
    return {
      passport: this.passport(passenger),
      type: this.passengerType(passenger),
      phoneType: 'HOME_PHONE',
      phoneNumber: contact?.phone ?? '',
      countryCode: contact?.countryCode ?? '',
      areaCode: contact?.areaCode ?? '',
    };
  }

  private passport(passenger: FlightBookingPassenger) {
    return {
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      middleName: passenger.middleName ?? '',
      citizenship: { code: passenger.citizenshipCountryCode, name: '' },
      issued: this.toCbsDate(passenger.document.issuedAt),
      expired: this.toCbsDate(passenger.document.expiresAt),
      number: passenger.document.number,
      type: this.passportType(passenger.document.type),
      birthday: this.toCbsDate(passenger.birthDate),
      gender: this.gender(passenger.gender),
    };
  }

  private passengerType(passenger: FlightBookingPassenger) {
    return CBS_PASSENGER_TYPE_BY_DOMAIN[passenger.passengerType];
  }

  private async request(
    command: CbsCommand,
    parameters: unknown,
  ): Promise<CbsBookingResponse> {
    const body = { query: { context: this.context(command), parameters } };
    return this.post(body);
  }

  private context(command: CbsCommand) {
    const credentials = this.credentials();
    const time = new Date().toISOString();
    return {
      agency: credentials.agency,
      user: credentials.user,
      time,
      hash: this.hash(credentials, time),
      locale: this.config.get<string>('CBS_LOCALE') ?? 'ru',
      command,
    };
  }

  private credentials(): CbsCredentials {
    return {
      agency: this.config.getOrThrow<string>('CBS_AGENCY_ID'),
      user: this.config.getOrThrow<string>('CBS_USER_ID'),
      password: this.config.getOrThrow<string>('CBS_PASSWORD'),
    };
  }

  private hash(credentials: CbsCredentials, time: string): string {
    return createCbsSignature({
      agency: credentials.agency,
      password: credentials.password,
      time,
      user: credentials.user,
    });
  }

  private async post(body: unknown): Promise<CbsBookingResponse> {
    try {
      const response = await fetch(this.config.getOrThrow('CBS_BASE_URL'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeout()),
      });
      if (!response.ok) throw new Error(`CBS HTTP ${response.status}`);
      return (await response.json()) as CbsBookingResponse;
    } catch (error) {
      throw this.providerUnavailable(error);
    }
  }

  private timeout(): number {
    return this.config.get<number>('CBS_TIMEOUT_MS') ?? 30_000;
  }

  private providerUnavailable(error: unknown): ServiceUnavailableException {
    return new ServiceUnavailableException({
      code: 'PROVIDER_UNAVAILABLE',
      message: 'Flight booking provider is unavailable',
      details: error instanceof Error ? error.message : undefined,
    });
  }

  private map(response: CbsBookingResponse): FlightBookingResult {
    const booking = response.respond?.bookingFile;
    if (!booking?.token) this.bookingFailed();
    const reservation = booking.reservations?.reservation?.[0];
    return {
      providerBookingToken: booking.token,
      recordLocator: reservation?.recordLocator || null,
      expiresAt: this.expiry(reservation?.timeLimit),
      providerStatus: booking.status ?? 'UNKNOWN',
    };
  }

  private expiry(value?: string): string | null {
    return value ? new Date(value).toISOString() : null;
  }

  private bookingFailed(): never {
    throw new ServiceUnavailableException({
      code: 'FLIGHT_BOOKING_FAILED',
      message: 'CBS returned no booking token',
    });
  }

  private toCbsDate(value: string | null): string {
    return value ? `${value}T12:00:00+00:00` : '';
  }

  private gender(value: TravelerGender): CbsGender {
    return value === TravelerGender.FEMALE ? CbsGender.FEMALE : CbsGender.MALE;
  }

  private passportType(value: TravelerDocumentType): CbsPassportType {
    if (value === TravelerDocumentType.NATIONAL_PASSPORT) {
      return CbsPassportType.INTERNAL;
    }
    if (value === TravelerDocumentType.INTERNATIONAL_PASSPORT) {
      return CbsPassportType.FOREIGN;
    }
    if (value === TravelerDocumentType.BIRTH_CERTIFICATE) {
      return CbsPassportType.BIRTH_CERTIFICATE;
    }
    return CbsPassportType.PASSPORT;
  }
}
