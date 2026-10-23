import { Inject, Injectable } from '@nestjs/common';
import type { FlightFareRules } from '../../domain';
import {
  FLIGHT_PROVIDER,
  type FlightProviderPort,
} from '../ports/flight-provider.port';
import {
  FLIGHT_OFFER_REPOSITORY,
  type FlightOfferRepository,
} from '../ports/flight-offer.repository';

@Injectable()
export class GetFlightFareRulesUseCase {
  constructor(
    @Inject(FLIGHT_OFFER_REPOSITORY)
    private readonly offers: FlightOfferRepository,
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProviderPort,
  ) {}
  async execute(id: string): Promise<FlightFareRules | null> {
    const offer = await this.offers.findOffer(id);
    return offer ? this.provider.getFareRules(offer) : null;
  }
}
