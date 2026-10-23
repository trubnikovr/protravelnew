import { Inject, Injectable } from '@nestjs/common';
import type { FlightOffer } from '../../domain';
import {
  FLIGHT_OFFER_REPOSITORY,
  type FlightOfferRepository,
} from '../ports/flight-offer.repository';

@Injectable()
export class GetFlightOfferUseCase {
  constructor(
    @Inject(FLIGHT_OFFER_REPOSITORY)
    private readonly offers: FlightOfferRepository,
  ) {}
  execute(id: string): Promise<FlightOffer | null> {
    return this.offers.findOffer(id);
  }
}
