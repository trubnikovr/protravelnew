import { Injectable } from '@nestjs/common';
import type { FlightOffer, FlightSearch } from '../../domain';
import type { FlightSearchRepository } from '../../application/ports/flight-search.repository';

@Injectable()
export class InMemoryFlightSearchRepository implements FlightSearchRepository {
  private readonly searches = new Map<string, FlightSearch>();
  private readonly offers = new Map<string, FlightOffer>();
  private readonly offerIdsBySearch = new Map<string, string[]>();

  saveSearch(search: FlightSearch): Promise<void> {
    this.searches.set(search.id.toString(), search);
    return Promise.resolve();
  }
  findSearch(id: string): Promise<FlightSearch | null> {
    return Promise.resolve(this.searches.get(id) ?? null);
  }
  saveOffers(searchId: string, offers: FlightOffer[]): Promise<void> {
    const ids = this.offerIdsBySearch.get(searchId) ?? [];
    for (const offer of offers) {
      this.offers.set(offer.id.toString(), offer);
      ids.push(offer.id.toString());
    }
    this.offerIdsBySearch.set(searchId, ids);
    return Promise.resolve();
  }
  findOffers(searchId: string): Promise<FlightOffer[]> {
    return Promise.resolve(
      (this.offerIdsBySearch.get(searchId) ?? [])
        .map((id) => this.offers.get(id))
        .filter((offer): offer is FlightOffer => Boolean(offer)),
    );
  }
  findOffer(id: string): Promise<FlightOffer | null> {
    return Promise.resolve(this.offers.get(id) ?? null);
  }
}
