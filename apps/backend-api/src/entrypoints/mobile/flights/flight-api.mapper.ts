import type { FlightOffer, FlightSearch } from '@modules/flights';
import { FlightOfferResponseDto } from './dto/response/flight-offer.response.dto';
import { FlightSearchResponseDto } from './dto/response/flight-search.response.dto';

export class FlightApiMapper {
  static toSearchResponse(search: FlightSearch): FlightSearchResponseDto {
    return {
      id: search.id.toString(),
      createdAt: search.createdAt.toISOString(),
      updatedAt: search.updatedAt.toISOString(),
      status: search.status,
      progress: search.progress,
      expiresAt: search.expiresAt.toISOString(),
      nextPollAfterMs: search.progress === 100 ? 0 : 1_000,
      errorCode: search.errorCode,
    };
  }
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
