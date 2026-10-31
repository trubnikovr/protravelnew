import type { AppLogger } from '@core/logging/app-logger';
import { CurrencyCode } from '@shared/domain/enums';
import { LocalDateValueObject } from '@shared/domain/value-objects';
import {
  FlightCabinClass,
  FlightPassengerType,
  FlightSortBy,
  type FlightOfferData,
  type FlightSearchCriteria,
} from '../../domain';
import type { FlightOfferRepository } from '../ports/flight-offer.repository';
import type { FlightProviderPort } from '../ports/flight-provider.port';
import type { FlightSearchCachePort } from '../ports/flight-search-cache.port';
import { SearchFlightsUseCase } from './search-flights.use-case';
import { FlightSearchAggregator } from '../services/flight-search-aggregator';

describe('SearchFlightsUseCase cache', () => {
  it('filters exact stops including zero and retains options after empty results', async () => {
    const withStops = (stops: number): FlightOfferData => ({
      ...offer,
      itineraries: [{ ...offer.itineraries[0], segments: Array.from({ length: stops + 1 }, () => ({ ...offer.itineraries[0].segments[0] })) }],
    });
    const offers = [withStops(0), withStops(1), withStops(2)];
    const useCase = new SearchFlightsUseCase(
      { save: jest.fn().mockResolvedValue(undefined) } as unknown as FlightOfferRepository,
      aggregator({ name: 'ttbooking', search: jest.fn() } as unknown as FlightProviderPort),
      { get: jest.fn().mockResolvedValue(offers), set: jest.fn() },
      { today: () => LocalDateValueObject.create('2026-01-01') },
      { setContext: jest.fn(), info: jest.fn() } as unknown as AppLogger,
    );
    for (const stopsCount of [0, 1, 2]) {
      const result = await useCase.execute({ ...criteria(), stopsCount });
      expect(result.total).toBe(1);
      expect(result.items[0].data.itineraries[0].segments).toHaveLength(stopsCount + 1);
      expect(result.filters.stops).toEqual([0, 1, 2].map(value => ({ value, count: 1 })));
    }
    const empty = await useCase.execute({ ...criteria(), stopsCount: 1, maxPrice: '1' });
    expect(empty.total).toBe(0);
    expect(empty.filters.stops).toHaveLength(3);
    const reset = await useCase.execute(criteria());
    expect(reset.total).toBe(3);
  });

  it('uses the maximum connections of either round-trip direction', async () => {
    const mixed = { ...offer, itineraries: [offer.itineraries[0], {
      ...offer.itineraries[0], segments: [offer.itineraries[0].segments[0], offer.itineraries[0].segments[0]],
    }] };
    const useCase = new SearchFlightsUseCase(
      { save: jest.fn() } as unknown as FlightOfferRepository,
      aggregator({ name: 'ttbooking', search: jest.fn() } as unknown as FlightProviderPort),
      { get: jest.fn().mockResolvedValue([mixed]), set: jest.fn() },
      { today: () => LocalDateValueObject.create('2026-01-01') },
      { setContext: jest.fn(), info: jest.fn() } as unknown as AppLogger,
    );
    expect((await useCase.execute({ ...criteria(), stopsCount: 0 })).total).toBe(0);
    expect((await useCase.execute({ ...criteria(), stopsCount: 1 })).total).toBe(1);
  });

  it('returns airline options alphabetically with stable code ordering', async () => {
    const offers = [
      ['ZZ', 'Ямал'], ['BB', 'Аэрофлот'], ['AA', 'аэрофлот'],
    ].map(([validatingCarrierCode, validatingCarrierName]) => ({
      ...offer, validatingCarrierCode, validatingCarrierName,
    }));
    const useCase = new SearchFlightsUseCase(
      { save: jest.fn() } as unknown as FlightOfferRepository,
      aggregator({ name: 'ttbooking', search: jest.fn() } as unknown as FlightProviderPort),
      { get: jest.fn().mockResolvedValue(offers), set: jest.fn() },
      { today: () => LocalDateValueObject.create('2026-01-01') },
      { setContext: jest.fn(), info: jest.fn() } as unknown as AppLogger,
    );
    const result = await useCase.execute(criteria());
    expect(result.filters.airlines.map(item => item.code)).toEqual(['AA', 'BB', 'ZZ']);
  });

  it('searches airport combinations and preserves the return airport pair', async () => {
    const providerSearch = jest.fn((input: FlightSearchCriteria) => {
      const origin = input.routes[0].origin;
      const destination = input.routes[0].destination;
      return Promise.resolve({
        offers: [
          {
            ...offer,
            itineraries: [
              {
                ...offer.itineraries[0],
                segments: [
                  {
                    ...offer.itineraries[0].segments[0],
                    origin: { code: origin, name: origin, terminal: null },
                    destination: {
                      code: destination,
                      name: destination,
                      terminal: null,
                    },
                  },
                ],
              },
            ],
            providerReference: {
              ...offer.providerReference,
              searchToken: origin,
            },
          },
        ],
      });
    });
    const useCase = new SearchFlightsUseCase(
      { save: jest.fn().mockResolvedValue(undefined) } as unknown as FlightOfferRepository,
      aggregator({
        name: 'ttbooking',
        search: providerSearch,
      } as unknown as FlightProviderPort),
      {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
      },
      { today: () => LocalDateValueObject.create('2026-01-01') },
      {
        setContext: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
      } as unknown as AppLogger,
    );

    const result = await useCase.execute({
      ...criteria(),
      routes: [
        {
          origin: 'MOW',
          originAirports: ['SVO', 'DME', 'VKO'],
          destination: 'LED',
          destinationAirports: ['LED'],
          departureDate: '2026-12-10',
        },
        {
          origin: 'LED',
          originAirports: ['LED'],
          destination: 'MOW',
          destinationAirports: ['SVO', 'DME', 'VKO'],
          departureDate: '2026-12-17',
        },
      ],
    });

    expect(providerSearch).toHaveBeenCalledTimes(3);
    expect(providerSearch.mock.calls.map(([input]) => input.routes)).toEqual([
      [
        { origin: 'SVO', destination: 'LED', departureDate: '2026-12-10' },
        { origin: 'LED', destination: 'SVO', departureDate: '2026-12-17' },
      ],
      [
        { origin: 'DME', destination: 'LED', departureDate: '2026-12-10' },
        { origin: 'LED', destination: 'DME', departureDate: '2026-12-17' },
      ],
      [
        { origin: 'VKO', destination: 'LED', departureDate: '2026-12-10' },
        { origin: 'LED', destination: 'VKO', departureDate: '2026-12-17' },
      ],
    ]);
    expect(result.total).toBe(3);
  });

  it('reuses raw provider offers when only result filters change', async () => {
    const providerSearch = jest
      .fn()
      .mockResolvedValue({ offers: [fastestOffer, offer] });
    const provider = {
      name: 'ttbooking',
      search: providerSearch,
    } as unknown as FlightProviderPort;
    const values = new Map<string, FlightOfferData[]>();
    const cacheGet = jest.fn((key: string) =>
      Promise.resolve(values.get(key) ?? null),
    );
    const cacheSet = jest.fn((key: string, offers: FlightOfferData[]) => {
      values.set(key, offers);
      return Promise.resolve();
    });
    const cache = { get: cacheGet, set: cacheSet } as FlightSearchCachePort;
    const repository = {
      save: jest.fn().mockResolvedValue(undefined),
    } as unknown as FlightOfferRepository;
    const clock = {
      today: () => LocalDateValueObject.create('2026-01-01'),
    };
    const logger = {
      setContext: jest.fn(),
      info: jest.fn(),
    } as unknown as AppLogger;
    const useCase = new SearchFlightsUseCase(
      repository,
      aggregator(provider),
      cache,
      clock,
      logger,
    );

    await useCase.execute(criteria());
    const filteredResult = await useCase.execute({
      ...criteria(),
      directOnly: true,
      maxPrice: '2000000',
      sortBy: FlightSortBy.PRICE,
    });

    expect(providerSearch).toHaveBeenCalledTimes(1);
    expect(providerSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        directOnly: false,
        maxPrice: undefined,
        preferredAirlines: [],
        sortBy: FlightSortBy.RECOMMENDED,
      }),
    );
    expect(cacheGet.mock.calls[0]?.[0]).toBe(cacheGet.mock.calls[1]?.[0]);
    expect(filteredResult.total).toBe(2);
    expect(filteredResult.items[0]?.data.totalAmount).toBe('1500000');
    expect(filteredResult.items[1]?.data.itineraries[0]?.durationMinutes).toBe(
      120,
    );
    expect(filteredResult.highlights).toEqual([
      {
        offerId: filteredResult.items[0]?.id.toString(),
        type: 'cheapest',
      },
      {
        offerId: filteredResult.items[1]?.id.toString(),
        type: 'fastest',
      },
    ]);
  });

  it('returns an empty result without caching, persisting or logging', async () => {
    const provider = {
      name: 'ttbooking',
      search: jest.fn().mockResolvedValue({ offers: [] }),
    } as unknown as FlightProviderPort;
    const repositorySave = jest.fn().mockResolvedValue(undefined);
    const repository = {
      save: repositorySave,
    } as unknown as FlightOfferRepository;
    const cacheSet = jest.fn().mockResolvedValue(undefined);
    const cache = {
      get: jest.fn().mockResolvedValue(null),
      set: cacheSet,
    } as FlightSearchCachePort;
    const loggerInfo = jest.fn();
    const logger = {
      setContext: jest.fn(),
      info: loggerInfo,
    } as unknown as AppLogger;
    const useCase = new SearchFlightsUseCase(
      repository,
      aggregator(provider),
      cache,
      { today: () => LocalDateValueObject.create('2026-01-01') },
      logger,
    );

    await expect(useCase.execute(criteria())).resolves.toMatchObject({
      items: [],
      total: 0,
      highlights: [],
    });
    expect(cacheSet).not.toHaveBeenCalled();
    expect(repositorySave).not.toHaveBeenCalled();
    expect(loggerInfo).not.toHaveBeenCalled();
  });
});

function aggregator(provider: FlightProviderPort): FlightSearchAggregator {
  return new FlightSearchAggregator(provider, {
    setContext: jest.fn(),
    warn: jest.fn(),
  } as unknown as AppLogger);
}

function criteria(): FlightSearchCriteria {
  return {
    routes: [
      { origin: 'TAS', destination: 'IST', departureDate: '2026-12-10' },
    ],
    passengers: [{ type: FlightPassengerType.ADULT, count: 1 }],
    cabinClass: FlightCabinClass.ECONOMY,
    directOnly: false,
    baggageRequired: false,
    preferredAirlines: [],
    sortBy: FlightSortBy.RECOMMENDED,
    page: 1,
    limit: 20,
  };
}

const offer: FlightOfferData = {
  provider: 'ttbooking',
  validatingCarrierCode: 'HY',
  validatingCarrierName: 'Uzbekistan Airways',
  itineraries: [
    {
      durationMinutes: 300,
      segments: [
        {
          carrierCode: 'HY',
          carrierName: 'Uzbekistan Airways',
          flightNumber: 'HY271',
          origin: { code: 'TAS', name: 'Tashkent', terminal: null },
          destination: { code: 'IST', name: 'Istanbul', terminal: null },
          departureLocal: '2026-12-10T08:00:00',
          arrivalLocal: '2026-12-10T13:00:00',
          durationMinutes: 300,
          cabinClass: FlightCabinClass.ECONOMY,
          bookingClass: 'Y',
          baggage: '1PC',
        },
      ],
    },
  ],
  totalAmount: '1500000',
  currency: CurrencyCode.RUB,
  electronicTicket: true,
  requiresLatinNames: true,
  expiresAt: '2026-12-10T06:00:00Z',
  providerReference: {
    searchToken: 'search',
    groupToken: 'group',
    itineraries: [
      {
        itineraryToken: 'itinerary',
        flightToken: 'flight',
        segmentTokens: ['segment'],
      },
    ],
  },
  passengers: [{ type: FlightPassengerType.ADULT, count: 1 }],
};

const fastestOffer: FlightOfferData = {
  ...offer,
  totalAmount: '1800000',
  itineraries: [
    {
      ...offer.itineraries[0],
      durationMinutes: 120,
      segments: [
        {
          ...offer.itineraries[0].segments[0],
          arrivalLocal: '2026-12-10T10:00:00',
          durationMinutes: 120,
        },
      ],
    },
  ],
  providerReference: {
    ...offer.providerReference,
    groupToken: 'fast-group',
  },
};
