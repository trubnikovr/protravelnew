import { Injectable } from '@nestjs/common';
import type { FlightOfferForOrderContract } from '@shared/contracts';
import { GetFlightOfferUseCase, type FlightOffer } from '@modules/flights';
import type { FlightOfferReaderPort } from '@modules/order-flight/application/flight-offer-reader.port';
import { FlightOfferForOrderMapper } from './flight-offer-for-order.mapper';

@Injectable()
export class FlightsModuleOfferReaderAdapter implements FlightOfferReaderPort {
  constructor(private readonly getOffer: GetFlightOfferUseCase) {}

  async get(offerId: string): Promise<FlightOfferForOrderContract | null> {
    return this.map(await this.getOffer.execute(offerId));
  }

  private map(offer: FlightOffer | null): FlightOfferForOrderContract | null {
    return offer ? FlightOfferForOrderMapper.toContract(offer) : null;
  }
}
