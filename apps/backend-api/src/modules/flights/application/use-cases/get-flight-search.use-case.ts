import { Inject, Injectable } from '@nestjs/common';
import type { FlightSearch } from '../../domain';
import {
  FLIGHT_SEARCH_REPOSITORY,
  type FlightSearchRepository,
} from '../ports/flight-search.repository';

@Injectable()
export class GetFlightSearchUseCase {
  constructor(
    @Inject(FLIGHT_SEARCH_REPOSITORY)
    private readonly searches: FlightSearchRepository,
  ) {}
  execute(id: string): Promise<FlightSearch | null> {
    return this.searches.findSearch(id);
  }
}
