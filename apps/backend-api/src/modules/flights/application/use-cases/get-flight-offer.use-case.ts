import { Inject, Injectable } from '@nestjs/common';
import type { FlightOffer } from '../../domain';
import {
  FLIGHT_SEARCH_REPOSITORY,
  type FlightSearchRepository,
} from '../ports/flight-search.repository';

@Injectable()
export class GetFlightOfferUseCase {
  constructor(
    @Inject(FLIGHT_SEARCH_REPOSITORY)
    private readonly searches: FlightSearchRepository,
  ) {}
  execute(id: string): Promise<FlightOffer | null> {
    return this.searches.findOffer(id);
  }
}
