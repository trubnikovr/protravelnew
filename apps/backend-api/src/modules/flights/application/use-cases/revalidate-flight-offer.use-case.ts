import { Inject, Injectable } from '@nestjs/common';
import { FlightOffer } from '../../domain';
import {
  FLIGHT_PROVIDER,
  type FlightProviderPort,
} from '../ports/flight-provider.port';
import {
  FLIGHT_OFFER_REPOSITORY,
  type FlightOfferRepository,
} from '../ports/flight-offer.repository';

@Injectable()
export class RevalidateFlightOfferUseCase {
  constructor(
    @Inject(FLIGHT_OFFER_REPOSITORY)
    private readonly offers: FlightOfferRepository,
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProviderPort,
  ) {}

  async execute(id: string): Promise<FlightOffer | null> {
    const current = await this.offers.findOffer(id);
    if (!current) return null;
    const data = await this.provider.revalidate(current);
    const result = FlightOffer.create(current.searchId.toString(), data);
    await this.offers.save([result]);
    return result;
  }
}
