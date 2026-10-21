import { Injectable, ServiceUnavailableException } from '@nestjs/common';
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
  CbsFlight,
  CbsFlightGroup,
  CbsFlightResponse,
  CbsItinerary,
  CbsRulesResponse,
} from './cbs.types';
import {
  CBS_PASSENGER_TYPE_BY_DOMAIN,
  CBS_SERVICE_CLASS_BY_DOMAIN,
  CbsCommand,
  CbsServiceClass,
  DOMAIN_CABIN_CLASS_BY_CBS,
} from '@app/integrations/cbs/cbs.constants';
import { createCbsSignature } from '@app/integrations/cbs/cbs-signature';

@Injectable()
export class CbsFlightProvider implements FlightProviderPort {
  readonly name = 'cbs';
  constructor(private readonly config: ConfigService) {}

  async search(
    criteria: FlightSearchCriteria,
  ): Promise<FlightSearchProviderResult> {
    const response = await this.request<CbsFlightResponse>(
      CbsCommand.SEARCH_FLIGHTS_RELEASE,
      {
        route: criteria.routes.map((route) => ({
          date: `${route.departureDate}T00:00:00`,
          locationBegin: { code: route.origin, name: '' },
          locationEnd: { code: route.destination, name: '' },
        })),
        seats: criteria.passengers.map((passenger) => ({
          count: passenger.count,
          passengerType: CBS_PASSENGER_TYPE_BY_DOMAIN[passenger.type],
        })),
        serviceClass: this.toCbsCabin(criteria.cabinClass),
        skipConnected: criteria.directOnly,
        eticketsOnly: true,
        mixedVendors: true,
        preferredAirlines: criteria.preferredAirlines.map((code) => ({
          code,
          name: '',
        })),
      },
    );
    return { offers: this.mapOffers(response, criteria.passengers) };
  }

  async revalidate(offer: FlightOffer): Promise<FlightOfferData> {
    const ref = offer.data.providerReference;
    const response = await this.request<CbsFlightResponse>(
      CbsCommand.SELECT_FLIGHT_RELEASE,
      {
        token: ref.searchToken,
        flightsGroup: {
          flightGroup: [
            {
              token: ref.groupToken,
              itineraries: {
                itinerary: ref.itineraries.map((item) => ({
                  token: item.itineraryToken,
                  flights: { flight: [{ token: item.flightToken }] },
                })),
              },
            },
          ],
        },
      },
    );
    const result = this.mapOffers(response, offer.data.passengers)[0];
    if (!result)
      throw new ServiceUnavailableException(
        'CBS returned no revalidated offer',
      );
    return result;
  }

  async getFareRules(offer: FlightOffer): Promise<FlightFareRules> {
    const url = this.config.get<string>('CBS_FARE_RULES_URL');
    if (!url)
      throw new ServiceUnavailableException(
        'CBS fare rules endpoint is not configured',
      );
    const ref = offer.data.providerReference;
    const response = await this.post<CbsRulesResponse>(url, {
      query: {
        context: {
          login: this.config.getOrThrow<string>('CBS_USER_ID'),
          password: this.config.getOrThrow<string>('CBS_PASSWORD'),
          salePoint: this.config.getOrThrow<string>('CBS_AGENCY_ID'),
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
    command: CbsCommand,
    parameters: unknown,
  ): Promise<T> {
    const time = new Date().toISOString();
    const agency = this.config.getOrThrow<string>('CBS_AGENCY_ID');
    const user = this.config.getOrThrow<string>('CBS_USER_ID');
    const password = this.config.getOrThrow<string>('CBS_PASSWORD');
    const hash = createCbsSignature({
      agency,
      password,
      time,
      user,
    });
    return this.post<T>(this.config.getOrThrow<string>('CBS_BASE_URL'), {
      query: {
        context: {
          agency,
          user,
          time,
          hash,
          locale: this.config.get<string>('CBS_LOCALE') ?? 'ru',
          command,
        },
        parameters,
      },
    });
  }

  private async post<T>(url: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(
          this.config.get<number>('CBS_TIMEOUT_MS') ?? 30_000,
        ),
      });
      if (!response.ok) throw new Error(`CBS HTTP ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      throw new ServiceUnavailableException({
        code: 'PROVIDER_UNAVAILABLE',
        message: 'Flight provider is unavailable',
        details: error instanceof Error ? error.message : undefined,
      });
    }
  }

  private mapOffers(
    response: CbsFlightResponse,
    passengers: FlightSearchCriteria['passengers'],
  ): FlightOfferData[] {
    const searchToken = response.respond?.token ?? '';
    return (response.respond?.flightsGroup?.flightGroup ?? []).flatMap(
      (group) =>
        this.combinations(group.itineraries?.itinerary ?? []).map((flights) =>
          this.mapOffer(searchToken, group, flights, passengers),
        ),
    );
  }

  private combinations(
    itineraries: CbsItinerary[],
  ): Array<Array<{ itinerary: CbsItinerary; flight: CbsFlight }>> {
    return itineraries.reduce<
      Array<Array<{ itinerary: CbsItinerary; flight: CbsFlight }>>
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
    group: CbsFlightGroup,
    choices: Array<{ itinerary: CbsItinerary; flight: CbsFlight }>,
    passengers: FlightSearchCriteria['passengers'],
  ): FlightOfferData {
    const multiplier = this.config.get<number>('CBS_AMOUNT_MULTIPLIER') ?? 1;
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
            cabinClass: this.fromCbsCabin(segment.serviceClass),
            bookingClass: segment.bookingClass || null,
            baggage: segment.baggage?.type || segment.baggage?.value || null,
          })),
        };
      }),
      totalAmount: String(Math.round(rawTotal * multiplier)),
      currency:
        this.config.get<CurrencyCode>('CBS_DEFAULT_CURRENCY') ??
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

  private toCbsCabin(value: FlightCabinClass): CbsServiceClass {
    return CBS_SERVICE_CLASS_BY_DOMAIN[value];
  }
  private fromCbsCabin(value?: string): FlightCabinClass {
    return (
      DOMAIN_CABIN_CLASS_BY_CBS[value as CbsServiceClass] ??
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
