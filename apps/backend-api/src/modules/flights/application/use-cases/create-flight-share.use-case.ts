import { createHash, randomBytes } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import {
  FLIGHT_OFFER_REPOSITORY,
  type FlightOfferRepository,
} from '../ports/flight-offer.repository';
import {
  FLIGHT_SHARE_REPOSITORY,
  type FlightShareRepository,
} from '../ports/flight-share.repository';
import type { FlightOffer } from '../../domain';

const SHARE_LIFETIME_DAYS = 30;

@Injectable()
export class CreateFlightShareUseCase {
  constructor(
    @Inject(FLIGHT_OFFER_REPOSITORY)
    private readonly offers: FlightOfferRepository,
    @Inject(FLIGHT_SHARE_REPOSITORY)
    private readonly shares: FlightShareRepository,
  ) {}

  async execute(offerId: string): Promise<{
    token: string;
    expiresAt: Date;
  } | null> {
    const offer = await this.offers.findOffer(offerId);
    if (!offer || new Date(offer.data.expiresAt).getTime() <= Date.now()) {
      return null;
    }

    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(
      Date.now() + SHARE_LIFETIME_DAYS * 24 * 60 * 60 * 1000,
    );

    await this.shares.create({
      tokenHash,
      snapshot: this.snapshot(offer),
      expiresAt,
    });

    return { token, expiresAt };
  }

  private snapshot(offer: FlightOffer) {
    const data = offer.data;
    return {
      airlineCode: data.validatingCarrierCode,
      airlineName: data.validatingCarrierName,
      totalAmount: data.totalAmount,
      currency: data.currency,
      itineraries: data.itineraries.map((itinerary) => ({
        durationMinutes: itinerary.durationMinutes,
        segments: itinerary.segments.map((segment) => ({
          carrierCode: segment.carrierCode,
          carrierName: segment.carrierName,
          flightNumber: segment.flightNumber,
          origin: { ...segment.origin },
          destination: { ...segment.destination },
          departureLocal: segment.departureLocal,
          arrivalLocal: segment.arrivalLocal,
          durationMinutes: segment.durationMinutes,
          cabinClass: segment.cabinClass,
          baggage: segment.baggage,
        })),
      })),
    };
  }
}
