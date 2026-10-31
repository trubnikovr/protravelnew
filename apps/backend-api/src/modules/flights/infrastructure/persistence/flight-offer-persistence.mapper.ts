import { FlightOffer } from '../../domain';
import { flightOffers, type FlightOfferRecord } from './flight-offer.schema';

type FlightOfferInsert = typeof flightOffers.$inferInsert;

export class FlightOfferPersistenceMapper {
  static toInsert(offer: FlightOffer): FlightOfferInsert {
    return {
      id: offer.id.toString(),
      searchId: offer.searchId.toString(),
      data: offer.data,
      expiresAt: new Date(offer.data.expiresAt),
      createdAt: offer.createdAt.toDate(),
      updatedAt: offer.updatedAt.toDate(),
    };
  }

  static toDomain(record: FlightOfferRecord): FlightOffer {
    return FlightOffer.restore({
      id: record.id,
      searchId: record.searchId,
      data: record.data,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
