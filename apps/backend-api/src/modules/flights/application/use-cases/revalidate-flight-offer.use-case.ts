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
export class RevalidateFlightOfferUseCase {
  constructor(
    @Inject(FLIGHT_SEARCH_REPOSITORY)
    private readonly searches: FlightSearchRepository,
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProviderPort,
  ) {}

  async execute(id: string): Promise<FlightOffer | null> {
    const current = await this.searches.findOffer(id);
    if (!current) return null;
    const data = await this.provider.revalidate(current);
    const result = FlightOffer.create(current.searchId.toString(), data);
    await this.searches.saveOffers(current.searchId.toString(), [result]);
    return result;
  }
}
