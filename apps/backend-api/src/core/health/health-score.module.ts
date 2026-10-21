import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core/database/database.module';
import { QueueModule } from '@core/queue/queue.module';
import { ObservabilityModule } from '@core/observability/observability.module';
import { HealthScoreService } from './health-score.service';

@Module({
  imports: [DatabaseModule, QueueModule, ObservabilityModule],
  providers: [HealthScoreService],
  exports: [HealthScoreService],
})
export class HealthScoreModule {}
