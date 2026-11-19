import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { LoggingModule } from './logging/logging.module';
import { QueueModule } from './queue/queue.module';
import { HealthScoreModule } from './health/health-score.module';
import { HttpModule } from './http/http.module';
import { ObservabilityModule } from './observability/observability.module';
import { DomainEventsModule } from './events/domain-events.module';
import { TimeModule } from './time/time.module';
import { CacheModule } from './cache/cache.module';

const CORE_MODULES = [
  AppConfigModule,
  DatabaseModule,
  LoggingModule,
  QueueModule,
  HealthScoreModule,
  HttpModule,
  ObservabilityModule,
  DomainEventsModule,
  TimeModule,
  CacheModule,
];

@Global()
@Module({
  imports: CORE_MODULES,
  exports: CORE_MODULES,
})
export class CoreModule {}
