import { Module } from '@nestjs/common';
import { HealthScoreModule } from '@core/health/health-score.module';
import { HealthController } from './health.controller';

@Module({
  imports: [HealthScoreModule],
  controllers: [HealthController],
})
export class HealthEntrypointModule {}
