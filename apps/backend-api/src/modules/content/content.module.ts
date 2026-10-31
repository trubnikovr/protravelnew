import { Module } from '@nestjs/common';
import { NewsService } from './application/news.service';
import { NEWS_REPOSITORY } from './application/news.repository';
import { DrizzleNewsRepository } from './infrastructure/persistence/drizzle-news.repository';
import { SystemMessagesService } from './application/system-messages.service';
import { SYSTEM_MESSAGES_REPOSITORY } from './application/system-messages.repository';
import { DrizzleSystemMessagesRepository } from './infrastructure/persistence/drizzle-system-messages.repository';
import { TravelFactsService } from './application/travel-facts.service';
import { TRAVEL_FACTS_REPOSITORY } from './application/travel-facts.repository';
import { DrizzleTravelFactsRepository } from './infrastructure/persistence/drizzle-travel-facts.repository';

@Module({
  providers: [
    NewsService,
    SystemMessagesService,
    TravelFactsService,
    { provide: NEWS_REPOSITORY, useClass: DrizzleNewsRepository },
    {
      provide: SYSTEM_MESSAGES_REPOSITORY,
      useClass: DrizzleSystemMessagesRepository,
    },
    {
      provide: TRAVEL_FACTS_REPOSITORY,
      useClass: DrizzleTravelFactsRepository,
    },
  ],
  exports: [NewsService, SystemMessagesService, TravelFactsService],
})
export class ContentModule {}
