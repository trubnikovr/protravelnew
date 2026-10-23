import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FLIGHT_PROVIDER } from './application/ports/flight-provider.port';
import { FLIGHT_OFFER_REPOSITORY } from './application/ports/flight-offer.repository';
import { SearchFlightsUseCase } from './application/use-cases/search-flights.use-case';
import { GetFlightFareRulesUseCase } from './application/use-cases/get-flight-fare-rules.use-case';
import { GetFlightOfferUseCase } from './application/use-cases/get-flight-offer.use-case';
import { RevalidateFlightOfferUseCase } from './application/use-cases/revalidate-flight-offer.use-case';
import { InMemoryFlightOfferRepository } from './infrastructure/persistence/in-memory-flight-offer.repository';
import { TtbookingFlightProvider } from './infrastructure/providers/ttbooking/ttbooking-flight.provider';
import { MockFlightProvider } from './infrastructure/providers/mock/mock-flight.provider';
import { TtbookingErrorMapper } from '@app/integrations/ttbooking/ttbooking-error.mapper';
import { FLIGHT_SEARCH_CACHE } from './application/ports/flight-search-cache.port';
import { RedisFlightSearchCache } from './infrastructure/cache/redis-flight-search-cache';

const useCases = [
  SearchFlightsUseCase,
  GetFlightOfferUseCase,
  RevalidateFlightOfferUseCase,
  GetFlightFareRulesUseCase,
];

@Module({
  providers: [
    ...useCases,
    InMemoryFlightOfferRepository,
    MockFlightProvider,
    TtbookingFlightProvider,
    TtbookingErrorMapper,
    RedisFlightSearchCache,
    {
      provide: FLIGHT_OFFER_REPOSITORY,
      useExisting: InMemoryFlightOfferRepository,
    },
    {
      provide: FLIGHT_SEARCH_CACHE,
      useExisting: RedisFlightSearchCache,
    },
    {
      provide: FLIGHT_PROVIDER,
      inject: [ConfigService, MockFlightProvider, TtbookingFlightProvider],
      useFactory: (
        config: ConfigService,
        mock: MockFlightProvider,
        ttbooking: TtbookingFlightProvider,
      ) =>
        config.get<string>('FLIGHT_PROVIDER') === 'ttbooking'
          ? ttbooking
          : mock,
    },
  ],
  exports: useCases,
})
export class FlightsModule {}
