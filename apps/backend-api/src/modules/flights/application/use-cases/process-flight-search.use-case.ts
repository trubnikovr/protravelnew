import { Inject, Injectable } from '@nestjs/common';
import { FlightOffer } from '../../domain';
import {
  FLIGHT_PROVIDER,
  type FlightProviderPort,
} from '../ports/flight-provider.port';
import {
  FLIGHT_SEARCH_REPOSITORY,
  type FlightSearchRepository,
} from '../ports/flight-search.repository';

@Injectable()
export class ProcessFlightSearchUseCase {
  constructor(
    @Inject(FLIGHT_SEARCH_REPOSITORY)
    private readonly searches: FlightSearchRepository,
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProviderPort,
  ) {}

  async execute(searchId: string): Promise<void> {
    const search = await this.searches.findSearch(searchId);
    if (!search) return;
    search.markRunning();
    await this.searches.saveSearch(search);
    try {
      const result = await this.provider.search(search.criteria);
      await this.searches.saveOffers(
        searchId,
        result.offers.map((offer) => FlightOffer.create(searchId, offer)),
      );
      search.complete(result.partial);
      await this.searches.saveSearch(search);
    } catch (error) {
      search.fail('PROVIDER_UNAVAILABLE');
      await this.searches.saveSearch(search);
      throw error;
    }
  }
}
