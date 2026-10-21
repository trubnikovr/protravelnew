import { Injectable } from '@nestjs/common';
import type { FlightOfferForOrderContract } from '@shared/contracts';
import {
  GetFlightOfferUseCase,
  RevalidateFlightOfferUseCase,
  type FlightOffer,
} from '@modules/flights';
import type { FlightOfferReaderPort } from '@modules/order-flight/application/flight-offer-reader.port';
import { FlightOfferForOrderMapper } from './flight-offer-for-order.mapper';

@Injectable()
export class FlightsModuleOfferReaderAdapter implements FlightOfferReaderPort {
  constructor(
    private readonly getOffer: GetFlightOfferUseCase,
    private readonly revalidateOffer: RevalidateFlightOfferUseCase,
  ) {}

  async get(offerId: string): Promise<FlightOfferForOrderContract | null> {
    return this.map(await this.getOffer.execute(offerId));
  }

  async revalidate(
    offerId: string,
  ): Promise<FlightOfferForOrderContract | null> {
    return this.map(await this.revalidateOffer.execute(offerId));
  }

  private map(offer: FlightOffer | null): FlightOfferForOrderContract | null {
    return offer ? FlightOfferForOrderMapper.toContract(offer) : null;
  }
}
