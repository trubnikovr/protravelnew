import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { AppHttpException } from '@core/http/errors/app-http.exception';
import {
  APPLICATION_CLOCK,
  type ApplicationClock,
} from '@core/time/application-clock';
import {
  FlightOffer,
  FlightHighlightType,
  FlightPassengerType,
  FlightSortBy,
  type FlightOfferData,
  type FlightSearchCriteria,
  type FlightSearchFilters,
} from '../../domain';
import {
  FLIGHT_OFFER_REPOSITORY,
  type FlightOfferRepository,
} from '../ports/flight-offer.repository';
import {
  FLIGHT_SEARCH_CACHE,
  type FlightSearchCachePort,
} from '../ports/flight-search-cache.port';
import {
  EntityIdValueObject,
  LocalDateValueObject,
} from '@shared/domain/value-objects';
import { AppLogger } from '@core/logging/app-logger';
import { FlightSearchAggregator } from '../services/flight-search-aggregator';

@Injectable()
export class SearchFlightsUseCase {
  private static readonly CACHE_TTL_SECONDS = 5 * 60;
  constructor(
    @Inject(FLIGHT_OFFER_REPOSITORY)
    private readonly offers: FlightOfferRepository,
    private readonly searchAggregator: FlightSearchAggregator,
    @Inject(FLIGHT_SEARCH_CACHE)
    private readonly cache: FlightSearchCachePort,
    @Inject(APPLICATION_CLOCK) private readonly clock: ApplicationClock,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(SearchFlightsUseCase.name);
  }

  async execute(criteria: FlightSearchCriteria) {
    this.validate(criteria);

    const cacheKey = this.cacheKey(criteria);
    const cachedOffers = await this.cache.get(cacheKey);
    if (cachedOffers?.length) return this.createResult(cachedOffers, criteria);

    const providerOffers = await this.searchAggregator.search(
      this.withoutResultFilters(criteria),
    );
    if (!providerOffers.length) return this.emptyResult();

    await this.cache.set(
      cacheKey,
      providerOffers,
      SearchFlightsUseCase.CACHE_TTL_SECONDS,
    );
    return this.createResult(providerOffers, criteria);
  }

  private async createResult(
    providerOffers: FlightOfferData[],
    criteria: FlightSearchCriteria,
  ) {
    const offerData = this.filterAndSort(providerOffers, criteria);
    if (!offerData.length) return this.emptyResult([], providerOffers);
    const highlighted = this.highlight(offerData);
    const pageOffers = this.page(
      highlighted.offers,
      criteria.page,
      criteria.limit,
    );
    if (!pageOffers.length) return this.emptyResult(offerData, providerOffers);
    return this.persistResult(
      pageOffers,
      offerData,
      highlighted.types,
      providerOffers,
      criteria,
    );
  }

  private async persistResult(
    pageOffers: FlightOfferData[],
    filteredOffers: FlightOfferData[],
    highlightTypes: Map<FlightOfferData, FlightHighlightType[]>,
    providerOffers: FlightOfferData[],
    criteria: FlightSearchCriteria,
  ) {
    const searchId = EntityIdValueObject.create().toString();
    const offers = pageOffers.map((offer) =>
      FlightOffer.create(searchId, offer),
    );
    await this.offers.save(offers);
    this.logSearchResult(criteria, providerOffers.length, filteredOffers.length);
    return {
      items: offers,
      total: filteredOffers.length,
      filters: this.buildFilters(providerOffers),
      highlights: offers.flatMap((offer, index) =>
        (highlightTypes.get(pageOffers[index]) ?? []).map((type) => ({
          offerId: offer.id.toString(),
          type,
        })),
      ),
    };
  }

  private emptyResult(filteredOffers: FlightOfferData[] = [], providerOffers = filteredOffers) {
    return {
      items: [] as FlightOffer[],
      total: filteredOffers.length,
      filters: this.buildFilters(providerOffers),
      highlights: [] as Array<{
        offerId: string;
        type: FlightHighlightType;
      }>,
    };
  }

  private highlight(offers: FlightOfferData[]): {
    offers: FlightOfferData[];
    types: Map<FlightOfferData, FlightHighlightType[]>;
  } {
    const types = new Map<FlightOfferData, FlightHighlightType[]>();
    if (!offers.length) return { offers, types };
    const cheapest = offers.reduce((current, offer) =>
      this.compareAmounts(offer.totalAmount, current.totalAmount) < 0
        ? offer
        : current,
    );
    const fastest = offers.reduce((current, offer) =>
      this.totalDuration(offer) < this.totalDuration(current) ? offer : current,
    );
    types.set(cheapest, [FlightHighlightType.CHEAPEST]);
    types.set(fastest, [
      ...(types.get(fastest) ?? []),
      FlightHighlightType.FASTEST,
    ]);
    const promoted = [...new Set([cheapest, fastest])];
    const promotedSet = new Set(promoted);
    return {
      offers: [
        ...promoted,
        ...offers.filter((offer) => !promotedSet.has(offer)),
      ],
      types,
    };
  }

  private logSearchResult(
    criteria: FlightSearchCriteria,
    providerOffers: number,
    filteredOffers: number,
  ): void {
    this.logger.info(
      {
        provider: this.searchAggregator.providerName,
        routeCount: criteria.routes.length,
        providerOffers,
        filteredOffers,
        activeFilters: this.activeFilterNames(criteria),
      },
      'Flight search result processed',
    );
  }

  private activeFilterNames(criteria: FlightSearchCriteria): string[] {
    return [
      criteria.directOnly ? 'directOnly' : null,
      criteria.baggageRequired ? 'baggageRequired' : null,
      criteria.preferredAirlines.length ? 'preferredAirlines' : null,
      criteria.maxStops !== undefined ? 'maxStops' : null,
      criteria.stopsCount !== undefined ? 'stopsCount' : null,
      criteria.maxDurationMinutes !== undefined ? 'maxDuration' : null,
      criteria.minPrice !== undefined ? 'minPrice' : null,
      criteria.maxPrice !== undefined ? 'maxPrice' : null,
      criteria.departureTimeFrom ? 'departureTime' : null,
      criteria.arrivalTimeFrom ? 'arrivalTime' : null,
    ].filter((value): value is string => value !== null);
  }

  private buildFilters(offers: FlightOfferData[]): FlightSearchFilters {
    const amounts = offers.map((offer) => BigInt(offer.totalAmount));
    const durations = offers.map((offer) => this.totalDuration(offer));
    const departures = offers.flatMap((offer) =>
      offer.itineraries.map((item) => item.segments[0]?.departureLocal),
    );
    return {
      price: this.amountRange(amounts),
      stops: this.stopOptions(offers),
      airlines: this.airlineOptions(offers),
      baggage: this.baggageOptions(offers),
      duration: this.numberRange(durations),
      departureTime: this.timeRange(departures),
    };
  }

  private amountRange(values: bigint[]) {
    if (!values.length) return { min: null, max: null };
    return {
      min: values
        .reduce((min, value) => (value < min ? value : min))
        .toString(),
      max: values
        .reduce((max, value) => (value > max ? value : max))
        .toString(),
    };
  }

  private numberRange(values: number[]) {
    if (!values.length) return { minMinutes: null, maxMinutes: null };
    return {
      minMinutes: Math.min(...values),
      maxMinutes: Math.max(...values),
    };
  }

  private timeRange(values: Array<string | undefined>) {
    const times = values.filter(Boolean).map((value) => value!.slice(11, 16));
    if (!times.length) return { min: null, max: null };
    return { min: times.sort()[0], max: times.at(-1) ?? null };
  }

  private offerStops(offer: FlightOfferData): number {
    return Math.max(0, ...offer.itineraries.map(item => item.segments.length - 1));
  }

  private stopOptions(offers: FlightOfferData[]) {
    const counts = new Map<number, number>();
    for (const offer of offers) {
      const stops = this.offerStops(offer);
      counts.set(stops, (counts.get(stops) ?? 0) + 1);
    }
    return [...counts]
      .sort(([left], [right]) => left - right)
      .map(([value, count]) => ({ value, count }));
  }

  private airlineOptions(offers: FlightOfferData[]) {
    const airlines = new Map<string, { name: string; count: number }>();
    for (const offer of offers) {
      const current = airlines.get(offer.validatingCarrierCode);
      airlines.set(offer.validatingCarrierCode, {
        name: offer.validatingCarrierName,
        count: (current?.count ?? 0) + 1,
      });
    }
    return [...airlines]
      .map(([code, value]) => ({ code, ...value }))
      .sort((left, right) =>
        (left.name || left.code).localeCompare(right.name || right.code, 'ru', { sensitivity: 'base' }) ||
        left.code.localeCompare(right.code),
      );
  }

  private baggageOptions(offers: FlightOfferData[]) {
    const included = offers.filter((offer) => this.hasBaggage(offer)).length;
    return { included, notIncluded: offers.length - included };
  }

  private hasBaggage(offer: FlightOfferData): boolean {
    return offer.itineraries.every((item) =>
      item.segments.every(
        (segment) => segment.baggage && segment.baggage.toUpperCase() !== '0PC',
      ),
    );
  }

  private page(offers: FlightOfferData[], page: number, limit: number) {
    const start = (page - 1) * limit;
    return offers.slice(start, start + limit);
  }

  private filterAndSort(
    offers: FlightOfferData[],
    criteria: FlightSearchCriteria,
  ): FlightOfferData[] {
    const filtered = offers.filter((offer) => {
      if (criteria.stopsCount !== undefined && this.offerStops(offer) !== criteria.stopsCount) return false;
      const amount = BigInt(offer.totalAmount);
      if (criteria.minPrice && amount < BigInt(criteria.minPrice)) return false;
      if (criteria.maxPrice && amount > BigInt(criteria.maxPrice)) return false;
      if (
        criteria.preferredAirlines.length > 0 &&
        !criteria.preferredAirlines.includes(offer.validatingCarrierCode)
      )
        return false;

      return (
        offer.itineraries.every((itinerary) =>
          this.itineraryMatches(itinerary, criteria),
        ) && this.outboundTimeMatches(offer, criteria)
      );
    });

    if (criteria.sortBy === FlightSortBy.RECOMMENDED) return filtered;
    return [...filtered].sort((left, right) => {
      if (criteria.sortBy === FlightSortBy.PRICE)
        return this.compareAmounts(left.totalAmount, right.totalAmount);
      if (criteria.sortBy === FlightSortBy.DURATION)
        return this.totalDuration(left) - this.totalDuration(right);
      return this.firstDeparture(left).localeCompare(
        this.firstDeparture(right),
      );
    });
  }

  private itineraryMatches(
    itinerary: FlightOfferData['itineraries'][number],
    criteria: FlightSearchCriteria,
  ): boolean {
    if (criteria.directOnly && itinerary.segments.length > 1) return false;
    if (
      criteria.maxStops !== undefined &&
      itinerary.segments.length - 1 > criteria.maxStops
    )
      return false;
    if (
      criteria.maxDurationMinutes !== undefined &&
      itinerary.durationMinutes > criteria.maxDurationMinutes
    )
      return false;
    return !criteria.baggageRequired || this.itineraryHasBaggage(itinerary);
  }

  private itineraryHasBaggage(
    itinerary: FlightOfferData['itineraries'][number],
  ): boolean {
    return itinerary.segments.every(
      (segment) => segment.baggage && segment.baggage.toUpperCase() !== '0PC',
    );
  }

  private outboundTimeMatches(
    offer: FlightOfferData,
    criteria: FlightSearchCriteria,
  ): boolean {
    const outbound = offer.itineraries[0];
    const first = outbound?.segments[0];
    const last = outbound?.segments.at(-1);
    if (!first || !last) return false;
    return (
      this.timeMatches(
        first.departureLocal,
        criteria.departureTimeFrom,
        criteria.departureTimeTo,
      ) &&
      this.timeMatches(
        last.arrivalLocal,
        criteria.arrivalTimeFrom,
        criteria.arrivalTimeTo,
      )
    );
  }

  private timeMatches(value: string, from?: string, to?: string): boolean {
    if (!from && !to) return true;
    const time = value.slice(11, 16);
    if (from && to && from > to) return time >= from || time <= to;
    return (!from || time >= from) && (!to || time <= to);
  }

  private compareAmounts(left: string, right: string): number {
    const leftAmount = BigInt(left);
    const rightAmount = BigInt(right);
    return leftAmount < rightAmount ? -1 : leftAmount > rightAmount ? 1 : 0;
  }

  private totalDuration(offer: FlightOfferData): number {
    return offer.itineraries.reduce(
      (total, itinerary) => total + itinerary.durationMinutes,
      0,
    );
  }

  private firstDeparture(offer: FlightOfferData): string {
    return offer.itineraries[0]?.segments[0]?.departureLocal ?? '';
  }

  private cacheKey(criteria: FlightSearchCriteria): string {
    const normalized = {
      routes: criteria.routes,
      cabinClass: criteria.cabinClass,
      passengers: [...criteria.passengers].sort((a, b) =>
        a.type.localeCompare(b.type),
      ),
    };
    const hash = createHash('sha256')
      .update(JSON.stringify(normalized))
      .digest('hex');
    return `protravel:flight-search:v2:${this.searchAggregator.providerName}:${hash}`;
  }

  private withoutResultFilters(
    criteria: FlightSearchCriteria,
  ): FlightSearchCriteria {
    return {
      ...criteria,
      directOnly: false,
      baggageRequired: false,
      preferredAirlines: [],
      departureTimeFrom: undefined,
      departureTimeTo: undefined,
      arrivalTimeFrom: undefined,
      arrivalTimeTo: undefined,
      maxStops: undefined,
      stopsCount: undefined,
      maxDurationMinutes: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: FlightSortBy.RECOMMENDED,
      page: 1,
      limit: 20,
    };
  }

  private validate(criteria: FlightSearchCriteria): void {
    this.validatePassengers(criteria);
    this.validateRoutes(criteria);
  }

  private validatePassengers(criteria: FlightSearchCriteria): void {
    const count = (type: FlightPassengerType): number =>
      criteria.passengers.find((item) => item.type === type)?.count ?? 0;
    const adults = count(FlightPassengerType.ADULT);
    const infants = count(FlightPassengerType.INFANT);
    const total = criteria.passengers.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    if (adults < 1) this.fail('FLIGHT_SEARCH_ADULT_REQUIRED');
    if (infants > adults) this.fail('FLIGHT_SEARCH_INFANTS_EXCEED_ADULTS');
    if (total > 9)
      this.fail('FLIGHT_SEARCH_PASSENGER_LIMIT_EXCEEDED', { total });
  }

  private validateRoutes(criteria: FlightSearchCriteria): void {
    const today = this.clock.today();
    const dates = criteria.routes.map((route, index) =>
      this.parseDate(route.departureDate, index),
    );
    criteria.routes.forEach((route, index) => {
      if (route.origin === route.destination)
        this.fail('FLIGHT_SEARCH_SAME_AIRPORT', { routeIndex: index });
      if (dates[index].isBefore(today))
        this.fail('FLIGHT_SEARCH_DATE_IN_PAST', { routeIndex: index });
      if (index > 0 && dates[index].isBefore(dates[index - 1]))
        this.fail('FLIGHT_SEARCH_DATES_NOT_CHRONOLOGICAL', {
          routeIndex: index,
        });
    });
  }

  private parseDate(value: string, routeIndex: number): LocalDateValueObject {
    try {
      return LocalDateValueObject.create(value);
    } catch {
      return this.fail('FLIGHT_SEARCH_DATE_INVALID', { routeIndex });
    }
  }

  private fail(code: string, details: unknown = null): never {
    throw new AppHttpException(HttpStatus.BAD_REQUEST, code, details);
  }
}
