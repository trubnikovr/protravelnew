import { Inject, Injectable } from '@nestjs/common';
import type { FlightOffer } from '../../domain';
import {
  FLIGHT_SEARCH_REPOSITORY,
  type FlightSearchRepository,
} from '../ports/flight-search.repository';

@Injectable()
export class GetFlightSearchResultsUseCase {
  constructor(
    @Inject(FLIGHT_SEARCH_REPOSITORY)
    private readonly searches: FlightSearchRepository,
  ) {}
  execute(searchId: string): Promise<FlightOffer[]> {
    return this.searches.findOffers(searchId);
  }
}
