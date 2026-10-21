import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  FlightPassengerType,
  FlightSearch,
  type FlightSearchCriteria,
} from '../../domain';
import {
  FLIGHT_SEARCH_QUEUE,
  type FlightSearchQueuePort,
} from '../ports/flight-search-queue.port';
import {
  FLIGHT_SEARCH_REPOSITORY,
  type FlightSearchRepository,
} from '../ports/flight-search.repository';

@Injectable()
export class CreateFlightSearchUseCase {
  constructor(
    @Inject(FLIGHT_SEARCH_REPOSITORY)
    private readonly searches: FlightSearchRepository,
    @Inject(FLIGHT_SEARCH_QUEUE) private readonly queue: FlightSearchQueuePort,
  ) {}

  async execute(criteria: FlightSearchCriteria): Promise<FlightSearch> {
    this.validate(criteria);
    const search = FlightSearch.create(criteria, 30 * 60);
    await this.searches.saveSearch(search);
    await this.queue.enqueue(search.id.toString());
    return search;
  }

  private validate(criteria: FlightSearchCriteria): void {
    const adults =
      criteria.passengers.find(({ type }) => type === FlightPassengerType.ADULT)
        ?.count ?? 0;
    const infants =
      criteria.passengers.find(
        ({ type }) => type === FlightPassengerType.INFANT,
      )?.count ?? 0;
    const total = criteria.passengers.reduce(
      (sum, group) => sum + group.count,
      0,
    );
    const today = new Date().toISOString().slice(0, 10);
    const invalid =
      adults < 1 ||
      infants > adults ||
      total > 9 ||
      criteria.routes.some(
        (route) =>
          route.origin === route.destination || route.departureDate < today,
      ) ||
      criteria.routes.some(
        (route, index) =>
          index > 0 &&
          route.departureDate < criteria.routes[index - 1].departureDate,
      );
    if (invalid) {
      throw new BadRequestException({
        code: 'INVALID_FLIGHT_SEARCH_CRITERIA',
        message: 'Flight routes or passenger composition are invalid',
      });
    }
  }
}
