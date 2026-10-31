import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FLIGHT_PROVIDER } from './application/ports/flight-provider.port';
import { FLIGHT_OFFER_REPOSITORY } from './application/ports/flight-offer.repository';
import { SearchFlightsUseCase } from './application/use-cases/search-flights.use-case';
import { GetFlightFareRulesUseCase } from './application/use-cases/get-flight-fare-rules.use-case';
import { GetFlightOfferUseCase } from './application/use-cases/get-flight-offer.use-case';
import { CreateFlightShareUseCase } from './application/use-cases/create-flight-share.use-case';
import { GetFlightShareUseCase } from './application/use-cases/get-flight-share.use-case';
import { DrizzleFlightOfferRepository } from './infrastructure/persistence/drizzle-flight-offer.repository';
import { DrizzleFlightShareRepository } from './infrastructure/persistence/drizzle-flight-share.repository';
import { FlightOfferCleanupService } from './infrastructure/persistence/flight-offer-cleanup.service';
import { TtbookingFlightProvider } from './infrastructure/providers/ttbooking/ttbooking-flight.provider';
import { MockFlightProvider } from './infrastructure/providers/mock/mock-flight.provider';
import { TtbookingErrorMapper } from '@app/integrations/ttbooking/ttbooking-error.mapper';
import { FLIGHT_SEARCH_CACHE } from './application/ports/flight-search-cache.port';
import { RedisFlightSearchCache } from './infrastructure/cache/redis-flight-search-cache';
import { FlightSearchAggregator } from './application/services/flight-search-aggregator';
import { FLIGHT_SHARE_REPOSITORY } from './application/ports/flight-share.repository';

const useCases = [
  SearchFlightsUseCase,
  GetFlightOfferUseCase,
  GetFlightFareRulesUseCase,
  CreateFlightShareUseCase,
  GetFlightShareUseCase,
];

@Module({
  providers: [
    ...useCases,
    DrizzleFlightOfferRepository,
    DrizzleFlightShareRepository,
    FlightOfferCleanupService,
    MockFlightProvider,
    TtbookingFlightProvider,
    TtbookingErrorMapper,
    FlightSearchAggregator,
    RedisFlightSearchCache,
    {
      provide: FLIGHT_OFFER_REPOSITORY,
      useExisting: DrizzleFlightOfferRepository,
    },
    {
      provide: FLIGHT_SHARE_REPOSITORY,
      useExisting: DrizzleFlightShareRepository,
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
