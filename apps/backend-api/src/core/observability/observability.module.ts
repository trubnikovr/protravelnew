import { Module } from '@nestjs/common';
import { ObservabilityHealthService } from './observability-health.service';

@Module({
  providers: [ObservabilityHealthService],
  exports: [ObservabilityHealthService],
})
export class ObservabilityModule {}
