import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppHttpException } from '@core/http/errors/app-http.exception';
import { AppLogger } from '@core/logging/app-logger';
import { prettyJson } from '@shared/tools';
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
    status?: string;
    messages?: { message?: Array<{ message?: string }> };
    bookingFile?: {
      token?: string;
      status?: string;
      reservations?: {
        reservation?: Array<{ recordLocator?: string; timeLimit?: string }>;
      };
    };
  };
}

interface TtbookingSelectionResponse {
  respond?: {
    token?: string;
    flightsGroup?: {
      flightGroup?: Array<{
        token?: string | number;
        fares?: { fareTotal?: { total?: number | string } };
        itineraries?: {
          itinerary?: Array<{
            token?: string | number;
            flights?: { flight?: Array<{ token?: string | number }> };
          }>;
        };
      }>;
    };
  };
}

interface TtbookingCredentials {
  agency: number;
  user: number;
  password: string;
}

@Injectable()
export class TtbookingFlightBookingProvider
  implements FlightBookingProviderPort
{
  constructor(
    private readonly config: ConfigService,
    private readonly errors: TtbookingErrorMapper,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(TtbookingFlightBookingProvider.name);
  }

  async book(
    offer: FlightOrderOfferSnapshot,
    passengers: FlightBookingPassenger[],
    contact: FlightOrderContact,
  ): Promise<FlightBookingResult> {
    const selected = await this.providerStep('SELECTFR', () =>
      this.selectFlight(offer),
    );
    const parameters = this.bookingParameters(selected, passengers, contact);
    console.log(12121212121212)
    console.log(prettyJson(parameters))
    const result = await this.providerStep('CREATEBR', () =>
      this.request(TtbookingCommand.CREATE_BOOKING_RELEASE, parameters).then(
        (result) => ({ ...this.map(result), totalAmount: selected.totalAmount }),
      ),
    );

    return result
  }

  private async providerStep<T>(
    command: string,
    action: () => Promise<T>,
  ): Promise<T> {
    const startedAt = performance.now();
    this.logger.info({ command }, 'TTBooking request started');
    try {
      const result = await action();
      this.logProviderCompletion(command, startedAt);
      return result;
    } catch (error) {
      this.logProviderFailure(command, startedAt);
      throw error;
    }
  }

  private logProviderCompletion(command: string, startedAt: number): void {
    this.logger.info({ command, durationMs: Math.round(performance.now() - startedAt) }, 'TTBooking request completed');
  }

  private logProviderFailure(command: string, startedAt: number): void {
    this.logger.warn('TTBooking request failed', { command, durationMs: Math.round(performance.now() - startedAt) });
  }

  private async selectFlight(
    offer: FlightOrderOfferSnapshot,
  ): Promise<FlightOrderOfferSnapshot> {
    const selected = await this.request<TtbookingSelectionResponse>(
      TtbookingCommand.SELECT_FLIGHT_RELEASE,
      {
        token: offer.providerReference.searchToken,
        flightsGroup: this.flightGroup(offer),
      },
    );
    return this.selectedOffer(offer, selected);
  }

  private selectedOffer(
    offer: FlightOrderOfferSnapshot,
    selected: TtbookingSelectionResponse,
  ): FlightOrderOfferSnapshot {
    const group = selected.respond?.flightsGroup?.flightGroup?.[0];
    if (this.invalidSelection(offer, selected)) {
      throw new AppHttpException(409, 'FLIGHT_OFFER_UNAVAILABLE');
    }
    const totalAmount = this.selectedPrice(offer, group?.fares?.fareTotal?.total);
    return { ...offer, totalAmount, providerReference: this.selectedReference(selected) };
  }

  private selectedReference(
    selected: TtbookingSelectionResponse,
  ): FlightOrderOfferSnapshot['providerReference'] {
    const group = selected.respond!.flightsGroup!.flightGroup![0];
    return {
      searchToken: selected.respond!.token!,
      groupToken: group.token!,
      itineraries: group.itineraries!.itinerary!.map((item) => ({
        itineraryToken: item.token!,
        flightToken: item.flights!.flight![0].token!,
        segmentTokens: [],
      })),
    };
  }

  private invalidSelection(
    offer: FlightOrderOfferSnapshot,
    selected: TtbookingSelectionResponse,
  ): boolean {
    const group = selected.respond?.flightsGroup?.flightGroup?.[0];
    const itineraries = group?.itineraries?.itinerary;
    return (
      !selected.respond?.token ||
      !this.validToken(group?.token) ||
      !itineraries ||
      itineraries.length !== offer.providerReference.itineraries.length ||
      itineraries.some((item) => !this.validToken(item.token) || item.flights?.flight?.length !== 1 || !this.validToken(item.flights.flight[0].token))
    );
  }

  private validToken(value: string | number | undefined): boolean {
    return typeof value === 'string' ? value.length > 0 : typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
  }

  private selectedPrice(
    offer: FlightOrderOfferSnapshot,
    total?: number | string,
  ): string {
    const amount = total === undefined || total === '' ? NaN : Number(total);
    const multiplier =
      this.config.get<number>('TTBOOKING_AMOUNT_MULTIPLIER') ?? 1;
    if (!Number.isFinite(amount) || amount < 0 || !Number.isSafeInteger(Math.round(amount * multiplier)))
      throw this.errors.unavailable('FLIGHT_BOOKING_FAILED');
    const selectedAmount = String(Math.round(amount * multiplier));
    if (selectedAmount !== offer.totalAmount) {
      this.logPriceChange(offer, selectedAmount, multiplier);
    }
    return selectedAmount;
  }

  private logPriceChange(offer: FlightOrderOfferSnapshot, selectedAmount: string, multiplier: number): void {
    this.logger.warn('TTBooking selected flight price differs from search', {
      searchedAmount: offer.totalAmount, selectedAmount, currency: offer.currency, multiplier,
    });
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
      customer: { name: contact.name, email: contact.email, countryCode: contact.countryCode, areaCode: contact.areaCode, phoneNumber: contact.phone },
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

  private async request<T = TtbookingBookingResponse>(
    command: TtbookingCommand,
    parameters: unknown,
  ): Promise<T> {
    const body = { context: this.context(command), parameters };
    return this.post<T>(body);
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

  private async post<T>(body: unknown): Promise<T> {
    try {
      const url = this.config.getOrThrow<string>('TTBOOKING_BASE_URL');
      const response = await fetch(url, {
        method: 'POST', headers: this.headers(),
        body: JSON.stringify(body), signal: AbortSignal.timeout(this.timeout()),
      });
      if (!response.ok) throw new TtbookingHttpError(response.status);
      const result: unknown = await response.json();
      console.error(prettyJson(result));
      return result as T;
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
    if (!booking?.token) this.bookingFailed(response);
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

  private bookingFailed(response: TtbookingBookingResponse): never {
    const messages = response.respond?.messages?.message ?? [];
    const duplicatePhone = messages.some((item) =>
      /телефон\s+агента\s*\/\s*покупателя\s+не\s+должен\s+совпадать\s+с\s+телефоном\s+пассажира/iu.test(item.message ?? ''),
    );
    if (response.respond?.status === 'BOOKING_NOT_CONFIRMED' && duplicatePhone) {
      throw new AppHttpException(422, 'FLIGHT_BOOKING_PHONE_MUST_DIFFER');
    }
    const invalidData = messages.some((item) => /сб\s+не\s+принимает\s+введ[её]нные\s+данные/iu.test(item.message ?? ''));
    if (response.respond?.status === 'BOOKING_NOT_CONFIRMED' && invalidData) {
      throw new AppHttpException(422, 'FLIGHT_BOOKING_PASSPORT_DATA_INVALID');
    }
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
