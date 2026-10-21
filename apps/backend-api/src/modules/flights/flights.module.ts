import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FLIGHT_PROVIDER } from './application/ports/flight-provider.port';
import { FLIGHT_SEARCH_QUEUE } from './application/ports/flight-search-queue.port';
import { FLIGHT_SEARCH_REPOSITORY } from './application/ports/flight-search.repository';
import { CreateFlightSearchUseCase } from './application/use-cases/create-flight-search.use-case';
import { GetFlightFareRulesUseCase } from './application/use-cases/get-flight-fare-rules.use-case';
import { GetFlightOfferUseCase } from './application/use-cases/get-flight-offer.use-case';
import { GetFlightSearchResultsUseCase } from './application/use-cases/get-flight-search-results.use-case';
import { GetFlightSearchUseCase } from './application/use-cases/get-flight-search.use-case';
import { ProcessFlightSearchUseCase } from './application/use-cases/process-flight-search.use-case';
import { RevalidateFlightOfferUseCase } from './application/use-cases/revalidate-flight-offer.use-case';
import { InMemoryFlightSearchRepository } from './infrastructure/persistence/in-memory-flight-search.repository';
import { CbsFlightProvider } from './infrastructure/providers/cbs/cbs-flight.provider';
import { MockFlightProvider } from './infrastructure/providers/mock/mock-flight.provider';
import {
  BullFlightSearchQueue,
  FLIGHT_SEARCH_QUEUE_NAME,
  FlightSearchProcessor,
} from './infrastructure/queue/bull-flight-search.queue';

const useCases = [
  CreateFlightSearchUseCase,
  ProcessFlightSearchUseCase,
  GetFlightSearchUseCase,
  GetFlightSearchResultsUseCase,
  GetFlightOfferUseCase,
  RevalidateFlightOfferUseCase,
  GetFlightFareRulesUseCase,
];

@Module({
  imports: [BullModule.registerQueue({ name: FLIGHT_SEARCH_QUEUE_NAME })],
  providers: [
    ...useCases,
    InMemoryFlightSearchRepository,
    MockFlightProvider,
    CbsFlightProvider,
    BullFlightSearchQueue,
    FlightSearchProcessor,
    {
      provide: FLIGHT_SEARCH_REPOSITORY,
      useExisting: InMemoryFlightSearchRepository,
    },
    { provide: FLIGHT_SEARCH_QUEUE, useExisting: BullFlightSearchQueue },
    {
      provide: FLIGHT_PROVIDER,
      inject: [ConfigService, MockFlightProvider, CbsFlightProvider],
      useFactory: (
        config: ConfigService,
        mock: MockFlightProvider,
        cbs: CbsFlightProvider,
      ) => (config.get<string>('FLIGHT_PROVIDER') === 'cbs' ? cbs : mock),
    },
  ],
  exports: useCases,
})
export class FlightsModule {}
