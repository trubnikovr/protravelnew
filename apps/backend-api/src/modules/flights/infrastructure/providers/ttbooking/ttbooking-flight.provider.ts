import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrencyCode } from '@shared/domain/enums';
import type {
  FlightProviderPort,
  FlightSearchProviderResult,
} from '../../../application/ports/flight-provider.port';
import {
  FlightCabinClass,
  type FlightFareRules,
  type FlightOffer,
  type FlightOfferData,
  type FlightSearchCriteria,
} from '../../../domain';
import type {
  TtbookingFlight,
  TtbookingFlightGroup,
  TtbookingFlightResponse,
  TtbookingItinerary,
  TtbookingRulesResponse,
} from './ttbooking.types';
import {
  TTBOOKING_PASSENGER_TYPE_BY_DOMAIN,
  TTBOOKING_SERVICE_CLASS_BY_DOMAIN,
  TtbookingCommand,
  TtbookingServiceClass,
  DOMAIN_CABIN_CLASS_BY_TTBOOKING,
} from '@app/integrations/ttbooking/ttbooking.constants';
import { createTtbookingSignature } from '@app/integrations/ttbooking/ttbooking-signature';
import {
  formatTtbookingTime,
  parseTtbookingId,
} from '@app/integrations/ttbooking/ttbooking-context';
import {
  TtbookingErrorMapper,
  TtbookingHttpError,
  TtbookingResponseTooLargeError,
} from '@app/integrations/ttbooking/ttbooking-error.mapper';
import { AppLogger } from '@core/logging/app-logger';
import { normalizeTtbookingBaggage } from './ttbooking-baggage';

@Injectable()
export class TtbookingFlightProvider implements FlightProviderPort {
  readonly name = 'ttbooking';
  constructor(
    private readonly config: ConfigService,
    private readonly errors: TtbookingErrorMapper,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(TtbookingFlightProvider.name);
  }

  async search(
    criteria: FlightSearchCriteria,
  ): Promise<FlightSearchProviderResult> {


    const response = await this.request<TtbookingFlightResponse>(
      TtbookingCommand.SEARCH_FLIGHTS_RELEASE,
      {
        route: criteria.routes.map((route) => ({
          date: `${route.departureDate}T00:00:00`,
          locationBegin: { code: route.origin, name: '' },
          locationEnd: { code: route.destination, name: '' },
        })),
        seats: criteria.passengers.map((passenger) => ({
          count: passenger.count,
          passengerType: TTBOOKING_PASSENGER_TYPE_BY_DOMAIN[passenger.type],
        })),
        serviceClass: this.toTtbookingCabin(criteria.cabinClass),
        skipConnected: criteria.directOnly,
        eticketsOnly: true,
        mixedVendors: true,
        preferredAirlines: criteria.preferredAirlines.map((code) => ({
          code,
          name: '',
        })),
      },
    );
    //console.log(JSON.stringify( response  , null, 2));
    const offers = this.mapOffers(response, criteria.passengers);

    this.logSearchShape(response, offers.length);

    return { offers };
  }

  async getFareRules(offer: FlightOffer): Promise<FlightFareRules> {
    const url = this.config.get<string>('TTBOOKING_FARE_RULES_URL');
    if (!url) throw this.errors.unavailable();
    const ref = offer.data.providerReference;
    const response = await this.post<TtbookingRulesResponse>(url, {
      context: {
        login: this.config.getOrThrow<string>('TTBOOKING_USER_ID'),
        password: this.config.getOrThrow<string>('TTBOOKING_PASSWORD'),
        salePoint: this.config.getOrThrow<string>('TTBOOKING_AGENCY_ID'),
        locale: 'ru',
        respondType: 'JSON',
      },
      parameters: {
        token: ref.searchToken,
        flightsGroup: {
          flightGroup: [
            {
              token: ref.groupToken,
              itineraries: {
                itinerary: ref.itineraries.map((item) => ({
                  token: item.itineraryToken,
                  flights: {
                    flight: [
                      {
                        token: item.flightToken,
                        segments: {
                          segment: item.segmentTokens.map((token) => ({
                            token,
                          })),
                        },
                      },
                    ],
                  },
                })),
              },
            },
          ],
        },
      },
    });
    return {
      sections: (response.respond?.remarkGroups?.remarkGroup ?? []).flatMap(
        (group) =>
          (group.remarks?.remark ?? []).map((rule) => ({
            code: rule.code ?? '',
            title: rule.title ?? '',
            content: rule.content ?? '',
          })),
      ),
    };
  }

  private async request<T>(
    command: TtbookingCommand,
    parameters: unknown,
  ): Promise<T> {
    const time = formatTtbookingTime();
    const agency = parseTtbookingId(
      this.config.getOrThrow<string>('TTBOOKING_AGENCY_ID'),
      'agency',
    );
    const user = parseTtbookingId(
      this.config.getOrThrow<string>('TTBOOKING_USER_ID'),
      'user',
    );
    const password = this.config.getOrThrow<string>('TTBOOKING_PASSWORD');
    const hash = createTtbookingSignature({
      agency,
      password,
      time,
      user,
    });
    return this.post<T>(this.config.getOrThrow<string>('TTBOOKING_BASE_URL'), {
      context: {
        agency,
        user,
        time,
        hash,
        locale: this.config.get<string>('TTBOOKING_LOCALE') ?? 'ru',
        command,
      },
      parameters,
    });
  }

  private async post<T>(url: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(
          this.config.get<number>('TTBOOKING_TIMEOUT_MS') ?? 60_000,
        ),
      });

      if (!response.ok) throw new TtbookingHttpError(response.status);
      return await this.readJson<T>(response);
    } catch (error) {
      throw this.errors.map(error);
    }
  }

  private async readJson<T>(response: Response): Promise<T> {
    const maximum =
      this.config.get<number>('TTBOOKING_MAX_RESPONSE_BYTES') ?? 10_485_760;
    const declared = Number(response.headers.get('content-length') ?? 0);
    if (declared > maximum) throw new TtbookingResponseTooLargeError();
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > maximum) throw new TtbookingResponseTooLargeError();
    return JSON.parse(buffer.toString('utf8')) as T;
  }

  private mapOffers(
    response: TtbookingFlightResponse,
    passengers: FlightSearchCriteria['passengers'],
  ): FlightOfferData[] {
    const searchToken = response.respond?.token ?? '';
    const maximum =
      this.config.get<number>('FLIGHT_SEARCH_MAX_OFFERS') ?? 5_000;
    const offers: FlightOfferData[] = [];
    for (const group of response.respond?.flightsGroup?.flightGroup ?? []) {
      for (const flights of this.combinations(
        group.itineraries?.itinerary ?? [],
      )) {
        offers.push(this.mapOffer(searchToken, group, flights, passengers));
        if (offers.length >= maximum) return offers;
      }
    }
    return offers;
  }

  private logSearchShape(
    response: TtbookingFlightResponse,
    normalizedOffers: number,
  ): void {
    const groups = response.respond?.flightsGroup?.flightGroup ?? [];
    const itineraries = groups.flatMap(
      (group) => group.itineraries?.itinerary ?? [],
    );
    this.logger.info(
      {
        groupCount: groups.length,
        itineraryCount: itineraries.length,
        flightOptionCount: itineraries.reduce(
          (total, itinerary) =>
            total + (itinerary.flights?.flight?.length ?? 0),
          0,
        ),
        normalizedOffers,
        hasRespond: Boolean(response.respond),
      },
      'TTBooking search response normalized',
    );
  }

  private combinations(
    itineraries: TtbookingItinerary[],
  ): Array<Array<{ itinerary: TtbookingItinerary; flight: TtbookingFlight }>> {
    return itineraries.reduce<
      Array<Array<{ itinerary: TtbookingItinerary; flight: TtbookingFlight }>>
    >(
      (result, itinerary) => {
        const flights = itinerary.flights?.flight ?? [];
        return result.flatMap((items) =>
          flights.map((flight) => [...items, { itinerary, flight }]),
        );
      },
      [[]],
    );
  }

  private mapOffer(
    searchToken: string,
    group: TtbookingFlightGroup,
    choices: Array<{ itinerary: TtbookingItinerary; flight: TtbookingFlight }>,
    passengers: FlightSearchCriteria['passengers'],
  ): FlightOfferData {
    const multiplier =
      this.config.get<number>('TTBOOKING_AMOUNT_MULTIPLIER') ?? 1;
    const rawTotal = Number(group.fares?.fareTotal?.total ?? 0);
    return {
      provider: this.name,
      validatingCarrierCode: group.carrier?.code ?? '',
      validatingCarrierName: group.carrier?.name ?? '',
      itineraries: choices.map(({ flight }) => {
        const segments = flight.segments?.segment ?? [];
        return {
          durationMinutes: segments.reduce(
            (sum, segment) => sum + (segment.travelDuration ?? 0),
            0,
          ),
          segments: segments.map((segment) => ({
            carrierCode: segment.carrier?.code ?? '',
            carrierName: segment.carrier?.name ?? '',
            flightNumber: segment.flightNumber ?? '',
            origin: {
              code: segment.locationBegin?.code ?? '',
              name: segment.locationBegin?.name ?? '',
              terminal: segment.terminalBegin || null,
            },
            destination: {
              code: segment.locationEnd?.code ?? '',
              name: segment.locationEnd?.name ?? '',
              terminal: segment.terminalEnd || null,
            },
            departureLocal: segment.dateBegin ?? '',
            arrivalLocal: segment.dateEnd ?? '',
            durationMinutes: segment.travelDuration ?? 0,
            cabinClass: this.fromTtbookingCabin(segment.serviceClass),
            bookingClass: segment.bookingClass || null,
            baggage: normalizeTtbookingBaggage(segment.baggage),
          })),
        };
      }),
      totalAmount: String(Math.round(rawTotal * multiplier)),
      currency:
        this.config.get<CurrencyCode>('TTBOOKING_DEFAULT_CURRENCY') ??
        CurrencyCode.RUB,
      electronicTicket: Boolean(group.eticket),
      requiresLatinNames: Boolean(group.latinRegistration),
      expiresAt: this.toExpiry(group.timeLimit),
      providerReference: {
        searchToken,
        groupToken: group.token ?? '',
        itineraries: choices.map(({ itinerary, flight }) => ({
          itineraryToken: itinerary.token ?? '',
          flightToken: flight.token ?? '',
          segmentTokens: (flight.segments?.segment ?? []).map(
            (segment) => segment.token ?? '',
          ),
        })),
      },
      passengers,
    };
  }

  private toTtbookingCabin(value: FlightCabinClass): TtbookingServiceClass {
    return TTBOOKING_SERVICE_CLASS_BY_DOMAIN[value];
  }
  private fromTtbookingCabin(value?: string): FlightCabinClass {
    return (
      DOMAIN_CABIN_CLASS_BY_TTBOOKING[value as TtbookingServiceClass] ??
      FlightCabinClass.ECONOMY
    );
  }
  private toExpiry(value?: string): string {
    const date = value ? new Date(value) : new Date(Number.NaN);
    return Number.isNaN(date.getTime())
      ? new Date(Date.now() + 15 * 60_000).toISOString()
      : date.toISOString();
  }
}
