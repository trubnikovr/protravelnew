import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { AppHttpException } from '@core/http/errors/app-http.exception';
import {
  APPLICATION_CLOCK,
  type ApplicationClock,
} from '@core/time/application-clock';
import {
  FlightOffer,
  FlightPassengerType,
  FlightSortBy,
  type FlightOfferData,
  type FlightSearchCriteria,
} from '../../domain';
import {
  FLIGHT_OFFER_REPOSITORY,
  type FlightOfferRepository,
} from '../ports/flight-offer.repository';
import {
  FLIGHT_PROVIDER,
  type FlightProviderPort,
} from '../ports/flight-provider.port';
import {
  FLIGHT_SEARCH_CACHE,
  type FlightSearchCachePort,
} from '../ports/flight-search-cache.port';
import {
  EntityIdValueObject,
  LocalDateValueObject,
} from '@shared/domain/value-objects';

@Injectable()
export class SearchFlightsUseCase {
  private static readonly CACHE_TTL_SECONDS = 300;

  constructor(
    @Inject(FLIGHT_OFFER_REPOSITORY)
    private readonly offers: FlightOfferRepository,
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProviderPort,
    @Inject(FLIGHT_SEARCH_CACHE)
    private readonly cache: FlightSearchCachePort,
    @Inject(APPLICATION_CLOCK) private readonly clock: ApplicationClock,
  ) {}

  async execute(criteria: FlightSearchCriteria): Promise<FlightOffer[]> {
    this.validate(criteria);
    const searchId = EntityIdValueObject.create().toString();
    const cacheKey = this.cacheKey(criteria);
    let offerData = await this.cache.get(cacheKey);
    if (!offerData) {
      const result = await this.provider.search(criteria);
      offerData = this.filterAndSort(result.offers, criteria);
      await this.cache.set(
        cacheKey,
        offerData,
        SearchFlightsUseCase.CACHE_TTL_SECONDS,
      );
    }
    const offers = offerData.map((offer) =>
      FlightOffer.create(searchId, offer),
    );
    await this.offers.save(offers);
    return offers;
  }

  private filterAndSort(
    offers: FlightOfferData[],
    criteria: FlightSearchCriteria,
  ): FlightOfferData[] {
    const filtered = offers.filter((offer) => {
      const amount = BigInt(offer.totalAmount);
      if (criteria.minPrice && amount < BigInt(criteria.minPrice)) return false;
      if (criteria.maxPrice && amount > BigInt(criteria.maxPrice)) return false;

      return offer.itineraries.every((itinerary) => {
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
        if (
          criteria.baggageRequired &&
          itinerary.segments.some(
            (segment) =>
              !segment.baggage || segment.baggage.toUpperCase() === '0PC',
          )
        )
          return false;

        const first = itinerary.segments[0];
        const last = itinerary.segments.at(-1);
        return (
          !!first &&
          !!last &&
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
      });
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
      ...criteria,
      passengers: [...criteria.passengers].sort((a, b) =>
        a.type.localeCompare(b.type),
      ),
      preferredAirlines: [...criteria.preferredAirlines].sort(),
    };
    const hash = createHash('sha256')
      .update(JSON.stringify(normalized))
      .digest('hex');
    return `protravel:flight-search:v1:${this.provider.name}:${hash}`;
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
