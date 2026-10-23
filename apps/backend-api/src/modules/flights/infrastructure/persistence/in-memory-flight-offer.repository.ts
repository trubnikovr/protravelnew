import { Injectable } from '@nestjs/common';
import type { FlightOffer } from '../../domain';
import type { FlightOfferRepository } from '../../application/ports/flight-offer.repository';

@Injectable()
export class InMemoryFlightOfferRepository implements FlightOfferRepository {
  private readonly offers = new Map<string, FlightOffer>();

  save(offers: FlightOffer[]): Promise<void> {
    for (const offer of offers) {
      this.offers.set(offer.id.toString(), offer);
    }
    return Promise.resolve();
  }
  findOffer(id: string): Promise<FlightOffer | null> {
    return Promise.resolve(this.offers.get(id) ?? null);
  }
}
