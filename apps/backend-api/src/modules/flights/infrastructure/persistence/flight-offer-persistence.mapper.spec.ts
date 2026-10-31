import { CurrencyCode } from '@shared/domain/enums';
import { FlightOffer, FlightPassengerType } from '../../domain';
import { FlightOfferPersistenceMapper } from './flight-offer-persistence.mapper';

describe('FlightOfferPersistenceMapper', () => {
  it('preserves provider references required for booking', () => {
    const offer = FlightOffer.create('00000000-0000-4000-8000-000000000001', {
      provider: 'ttbooking',
      validatingCarrierCode: 'HY',
      validatingCarrierName: 'Uzbekistan Airways',
      itineraries: [],
      totalAmount: '1200000',
      currency: CurrencyCode.RUB,
      electronicTicket: true,
      requiresLatinNames: true,
      expiresAt: '2026-10-27T12:00:00.000Z',
      passengers: [{ type: FlightPassengerType.ADULT, count: 1 }],
      providerReference: {
        searchToken: 'availability-token',
        groupToken: 'group-token',
        itineraries: [
          {
            itineraryToken: 'itinerary-token',
            flightToken: 'flight-token',
            segmentTokens: ['segment-token'],
          },
        ],
      },
    });
    const insert = FlightOfferPersistenceMapper.toInsert(offer);
    const restored = FlightOfferPersistenceMapper.toDomain({
      ...insert,
      createdAt: insert.createdAt!,
      updatedAt: insert.updatedAt!,
    });

    expect(restored.id.toString()).toBe(offer.id.toString());
    expect(restored.data.providerReference).toEqual(
      offer.data.providerReference,
    );
  });
});
