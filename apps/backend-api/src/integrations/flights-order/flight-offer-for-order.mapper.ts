import type { FlightOfferForOrderContract } from '@shared/contracts';
import type { FlightOffer } from '@modules/flights';

export class FlightOfferForOrderMapper {
  static toContract(offer: FlightOffer): FlightOfferForOrderContract {
    return {
      id: offer.id.toString(),
      provider: offer.data.provider,
      validatingCarrierCode: offer.data.validatingCarrierCode,
      validatingCarrierName: offer.data.validatingCarrierName,
      itineraries: offer.data.itineraries,
      totalAmount: offer.data.totalAmount,
      currency: offer.data.currency,
      expiresAt: offer.data.expiresAt,
      providerReference: offer.data.providerReference,
      passengers: offer.data.passengers,
    };
  }
}
