import { Injectable } from '@nestjs/common';
import { CurrencyCode } from '@shared/domain/enums';
import type {
  FlightProviderPort,
  FlightSearchProviderResult,
} from '../../../application/ports/flight-provider.port';
import type {
  FlightFareRules,
  FlightOffer,
  FlightOfferData,
  FlightSearchCriteria,
} from '../../../domain';

@Injectable()
export class MockFlightProvider implements FlightProviderPort {
  readonly name = 'mock';

  search(criteria: FlightSearchCriteria): Promise<FlightSearchProviderResult> {
    return Promise.resolve({
      offers: [this.createOffer(criteria, 0), this.createOffer(criteria, 1)],
    });
  }

  revalidate(offer: FlightOffer): Promise<FlightOfferData> {
    return Promise.resolve({
      ...offer.data,
      expiresAt: new Date(Date.now() + 20 * 60_000).toISOString(),
    });
  }

  getFareRules(): Promise<FlightFareRules> {
    return Promise.resolve({
      sections: [
        {
          code: 'CHANGES',
          title: 'Changes',
          content:
            'Changes are permitted before departure with an airline fee.',
        },
        {
          code: 'REFUNDS',
          title: 'Refunds',
          content: 'Refund conditions depend on the selected fare.',
        },
      ],
    });
  }

  private createOffer(
    criteria: FlightSearchCriteria,
    variant: number,
  ): FlightOfferData {
    const itineraries = criteria.routes.map((route, index) => {
      const departure = new Date(
        `${route.departureDate}T${variant ? '13:30' : '08:00'}:00Z`,
      );
      const arrival = new Date(
        departure.getTime() + (180 + variant * 35) * 60_000,
      );
      return {
        durationMinutes: 180 + variant * 35,
        segments: [
          {
            carrierCode: variant ? 'TK' : 'HY',
            carrierName: variant ? 'Turkish Airlines' : 'Аэрофлот',
            flightNumber: `${variant ? '369' : '271'}${index}`,
            origin: { code: route.origin, name: route.origin, terminal: null },
            destination: {
              code: route.destination,
              name: route.destination,
              terminal: null,
            },
            departureLocal: departure.toISOString().slice(0, 19),
            arrivalLocal: arrival.toISOString().slice(0, 19),
            durationMinutes: 180 + variant * 35,
            cabinClass: criteria.cabinClass,
            bookingClass: variant ? 'L' : 'Y',
            baggage: criteria.baggageRequired ? '1PC' : null,
          },
        ],
      };
    });
    const token = `mock-${variant}`;
    return {
      provider: this.name,
      validatingCarrierCode: variant ? 'TK' : 'HY',
      validatingCarrierName: variant ? 'Turkish Airlines' : 'Аэрофлот',
      itineraries,
      totalAmount: String(2_500_000 + variant * 700_000),
      currency: CurrencyCode.RUB,
      electronicTicket: true,
      requiresLatinNames: true,
      expiresAt: new Date(Date.now() + 20 * 60_000).toISOString(),
      providerReference: {
        searchToken: 'mock-search',
        groupToken: token,
        itineraries: itineraries.map((_, index) => ({
          itineraryToken: `${token}-itinerary-${index}`,
          flightToken: `${token}-flight-${index}`,
          segmentTokens: [`${token}-segment-${index}`],
        })),
      },
      passengers: criteria.passengers,
    };
  }
}
