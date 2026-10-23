import type { FlightOffer } from '@modules/flights';
import { FlightOfferResponseDto } from './dto/response/flight-offer.response.dto';

export class FlightApiMapper {
  static toOfferResponse(offer: FlightOffer): FlightOfferResponseDto {
    const data = offer.data;
    return {
      id: offer.id.toString(),
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
      provider: data.provider,
      validatingCarrierCode: data.validatingCarrierCode,
      validatingCarrierName: data.validatingCarrierName,
      itineraries: data.itineraries,
      totalAmount: data.totalAmount,
      currency: data.currency,
      electronicTicket: data.electronicTicket,
      requiresLatinNames: data.requiresLatinNames,
      expiresAt: data.expiresAt,
    };
  }
}
