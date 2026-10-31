import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TTBOOKING_PASSENGER_TYPE_BY_DOMAIN,
  TtbookingCommand,
  TtbookingGender,
  TtbookingPassportType,
} from '@app/integrations/ttbooking/ttbooking.constants';
import { createTtbookingSignature } from '@app/integrations/ttbooking/ttbooking-signature';
import {
  formatTtbookingTime,
  parseTtbookingId,
} from '@app/integrations/ttbooking/ttbooking-context';
import {
  TtbookingErrorMapper,
  TtbookingHttpError,
} from '@app/integrations/ttbooking/ttbooking-error.mapper';
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

interface TtbookingBookingResponse {
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

interface TtbookingCredentials {
  agency: number;
  user: number;
  password: string;
}

@Injectable()
export class TtbookingFlightBookingProvider implements FlightBookingProviderPort {
  constructor(
    private readonly config: ConfigService,
    private readonly errors: TtbookingErrorMapper,
  ) {}

  async book(
    offer: FlightOrderOfferSnapshot,
    passengers: FlightBookingPassenger[],
    contact: FlightOrderContact,
  ): Promise<FlightBookingResult> {
    const parameters = this.bookingParameters(offer, passengers, contact);
    const response = await this.request(
      TtbookingCommand.CREATE_BOOKING_RELEASE,
      parameters,
    );
    return this.map(response);
  }

  async refresh(providerBookingToken: string): Promise<FlightBookingResult> {
    const response = await this.request(TtbookingCommand.LOAD_BOOKING, {
      token: providerBookingToken,
    });
    return this.map(response);
  }

  async cancel(providerBookingToken: string): Promise<FlightBookingResult> {
    const response = await this.request(TtbookingCommand.CANCEL_BOOKING, {
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
      issued: this.toTtbookingDate(passenger.document.issuedAt),
      expired: this.toTtbookingDate(passenger.document.expiresAt),
      number: passenger.document.number,
      type: this.passportType(passenger.document.type),
      birthday: this.toTtbookingDate(passenger.birthDate),
      gender: this.gender(passenger.gender),
    };
  }

  private passengerType(passenger: FlightBookingPassenger) {
    return TTBOOKING_PASSENGER_TYPE_BY_DOMAIN[passenger.passengerType];
  }

  private async request(
    command: TtbookingCommand,
    parameters: unknown,
  ): Promise<TtbookingBookingResponse> {
    const body = { context: this.context(command), parameters };
    return this.post(body);
  }

  private context(command: TtbookingCommand) {
    const credentials = this.credentials();
    const time = formatTtbookingTime();
    return {
      agency: credentials.agency,
      user: credentials.user,
      time,
      hash: this.hash(credentials, time),
      locale: this.config.get<string>('TTBOOKING_LOCALE') ?? 'ru',
      command,
    };
  }

  private credentials(): TtbookingCredentials {
    return {
      agency: parseTtbookingId(
        this.config.getOrThrow<string>('TTBOOKING_AGENCY_ID'),
        'agency',
      ),
      user: parseTtbookingId(
        this.config.getOrThrow<string>('TTBOOKING_USER_ID'),
        'user',
      ),
      password: this.config.getOrThrow<string>('TTBOOKING_PASSWORD'),
    };
  }

  private hash(credentials: TtbookingCredentials, time: string): string {
    return createTtbookingSignature({
      agency: credentials.agency,
      password: credentials.password,
      time,
      user: credentials.user,
    });
  }

  private async post(body: unknown): Promise<TtbookingBookingResponse> {
    try {
      const url = this.config.getOrThrow<string>('TTBOOKING_BASE_URL');
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeout()),
      });
      if (!response.ok) throw new TtbookingHttpError(response.status);
      return (await response.json()) as TtbookingBookingResponse;
    } catch (error) {
      throw this.errors.map(error);
    }
  }

  private headers(): Record<string, string> {
    return { accept: 'application/json', 'content-type': 'application/json' };
  }

  private timeout(): number {
    return this.config.get<number>('TTBOOKING_TIMEOUT_MS') ?? 60_000;
  }

  private map(response: TtbookingBookingResponse): FlightBookingResult {
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
    throw this.errors.unavailable('FLIGHT_BOOKING_FAILED');
  }

  private toTtbookingDate(value: string | null): string {
    return value ? `${value}T12:00:00+00:00` : '';
  }

  private gender(value: TravelerGender): TtbookingGender {
    return value === TravelerGender.FEMALE
      ? TtbookingGender.FEMALE
      : TtbookingGender.MALE;
  }

  private passportType(value: TravelerDocumentType): TtbookingPassportType {
    if (value === TravelerDocumentType.NATIONAL_PASSPORT) {
      return TtbookingPassportType.INTERNAL;
    }
    if (value === TravelerDocumentType.INTERNATIONAL_PASSPORT) {
      return TtbookingPassportType.FOREIGN;
    }
    if (value === TravelerDocumentType.BIRTH_CERTIFICATE) {
      return TtbookingPassportType.BIRTH_CERTIFICATE;
    }
    return TtbookingPassportType.PASSPORT;
  }
}
