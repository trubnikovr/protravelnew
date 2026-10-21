import { Module } from '@nestjs/common';
import { NewsService } from './application/news.service';
import { NEWS_REPOSITORY } from './application/news.repository';
import { DrizzleNewsRepository } from './infrastructure/persistence/drizzle-news.repository';
import { SystemMessagesService } from './application/system-messages.service';
import { SYSTEM_MESSAGES_REPOSITORY } from './application/system-messages.repository';
import { DrizzleSystemMessagesRepository } from './infrastructure/persistence/drizzle-system-messages.repository';

@Module({
  providers: [
    NewsService,
    SystemMessagesService,
    { provide: NEWS_REPOSITORY, useClass: DrizzleNewsRepository },
    {
      provide: SYSTEM_MESSAGES_REPOSITORY,
      useClass: DrizzleSystemMessagesRepository,
    },
  ],
  exports: [NewsService, SystemMessagesService],
})
export class ContentModule {}
