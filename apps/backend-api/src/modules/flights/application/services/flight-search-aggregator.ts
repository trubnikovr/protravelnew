import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import pLimit from 'p-limit';
import { AppHttpException } from '@core/http/errors/app-http.exception';
import { AppLogger } from '@core/logging/app-logger';
import type {
  FlightOfferData,
  FlightRouteLeg,
  FlightSearchCriteria,
} from '../../domain';
import {
  FLIGHT_PROVIDER,
  type FlightProviderPort,
  type FlightSearchProviderResult,
} from '../ports/flight-provider.port';

@Injectable()
export class FlightSearchAggregator {
  private static readonly CONCURRENCY = 3;
  private static readonly MAX_COMBINATIONS = 36;

  constructor(
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProviderPort,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FlightSearchAggregator.name);
  }

  get providerName(): string {
    return this.provider.name;
  }

  async search(criteria: FlightSearchCriteria): Promise<FlightOfferData[]> {
    const providerRequests = this.expand(criteria);
    const results = await this.runLimited(providerRequests);
    const offers = results.flatMap((result) =>
      result.status === 'fulfilled' ? result.value.offers : [],
    );
    const failures = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    if (!offers.length && failures.length === providerRequests.length) {
      throw failures[0].reason;
    }
    if (failures.length) {
      this.logger.warn('Some airport combinations failed', {
        failedSearches: failures.length,
        totalSearches: providerRequests.length,
      });
    }
    return this.deduplicate(offers);
  }

  private async runLimited(
    providerRequests: FlightSearchCriteria[],
  ): Promise<PromiseSettledResult<FlightSearchProviderResult>[]> {
    const limit = pLimit(FlightSearchAggregator.CONCURRENCY);
    return Promise.allSettled(
      providerRequests.map((criteria) =>
        limit(() => this.provider.search(criteria)),
      ),
    );
  }

  private expand(criteria: FlightSearchCriteria): FlightSearchCriteria[] {
    const routeSets = criteria.routes.map((route) => ({
      route,
      origins: this.codes(route.origin, route.originAirports),
      destinations: this.codes(route.destination, route.destinationAirports),
    }));
    const combinations: FlightRouteLeg[][] = [];

    const visit = (index: number, selected: FlightRouteLeg[]): void => {
      if (combinations.length > FlightSearchAggregator.MAX_COMBINATIONS) return;
      if (index === routeSets.length) {
        combinations.push(selected);
        return;
      }

      const current = routeSets[index];
      const outbound = selected[0];
      if (
        index === 1 &&
        routeSets.length === 2 &&
        outbound &&
        current.origins.includes(outbound.destination) &&
        current.destinations.includes(outbound.origin)
      ) {
        visit(2, [
          ...selected,
          this.route(
            outbound.destination,
            outbound.origin,
            current.route.departureDate,
          ),
        ]);
        return;
      }

      for (const origin of current.origins) {
        for (const destination of current.destinations) {
          visit(index + 1, [
            ...selected,
            this.route(origin, destination, current.route.departureDate),
          ]);
        }
      }
    };

    visit(0, []);
    if (combinations.length > FlightSearchAggregator.MAX_COMBINATIONS) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'FLIGHT_SEARCH_TOO_MANY_AIRPORT_COMBINATIONS',
        { maximum: FlightSearchAggregator.MAX_COMBINATIONS },
      );
    }
    return combinations.map((routes) => ({ ...criteria, routes }));
  }

  private route(
    origin: string,
    destination: string,
    departureDate: string,
  ): FlightRouteLeg {
    return { origin, destination, departureDate };
  }

  private codes(primary: string, alternatives?: string[]): string[] {
    return [...new Set(alternatives?.length ? alternatives : [primary])];
  }

  private deduplicate(offers: FlightOfferData[]): FlightOfferData[] {
    return [
      ...new Map(offers.map((offer) => [this.offerKey(offer), offer])).values(),
    ];
  }

  private offerKey(offer: FlightOfferData): string {
    return JSON.stringify({
      amount: offer.totalAmount,
      currency: offer.currency,
      carrier: offer.validatingCarrierCode,
      itineraries: offer.itineraries.map((itinerary) =>
        itinerary.segments.map((segment) => ({
          carrier: segment.carrierCode,
          flight: segment.flightNumber,
          origin: segment.origin.code,
          destination: segment.destination.code,
          departure: segment.departureLocal,
          arrival: segment.arrivalLocal,
        })),
      ),
    });
  }
}
