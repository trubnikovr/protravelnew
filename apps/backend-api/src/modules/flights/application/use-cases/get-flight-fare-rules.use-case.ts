import { Inject, Injectable } from '@nestjs/common';
import type { FlightFareRules } from '../../domain';
import {
  FLIGHT_PROVIDER,
  type FlightProviderPort,
} from '../ports/flight-provider.port';
import {
  FLIGHT_SEARCH_REPOSITORY,
  type FlightSearchRepository,
} from '../ports/flight-search.repository';

@Injectable()
export class GetFlightFareRulesUseCase {
  constructor(
    @Inject(FLIGHT_SEARCH_REPOSITORY)
    private readonly searches: FlightSearchRepository,
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProviderPort,
  ) {}
  async execute(id: string): Promise<FlightFareRules | null> {
    const offer = await this.searches.findOffer(id);
    return offer ? this.provider.getFareRules(offer) : null;
  }
}
