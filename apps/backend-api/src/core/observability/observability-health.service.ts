import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { performance } from 'node:perf_hooks';
import type { HealthComponentResult } from '@core/health/health-score.types';

type ObservabilityKey =
  | 'grafana'
  | 'otelCollector'
  | 'tempo'
  | 'loki'
  | 'prometheus';

@Injectable()
export class ObservabilityHealthService {
  constructor(private readonly config: ConfigService) {}

  check(): Promise<HealthComponentResult[]> {
    return Promise.all([
      this.checkEndpoint('grafana', 'GRAFANA_HEALTH_URL'),
      this.checkEndpoint('otelCollector', 'OTEL_COLLECTOR_HEALTH_URL'),
      this.checkEndpoint('tempo', 'TEMPO_HEALTH_URL'),
      this.checkEndpoint('loki', 'LOKI_HEALTH_URL'),
      this.checkEndpoint('prometheus', 'PROMETHEUS_HEALTH_URL'),
    ]);
  }

  private async checkEndpoint(
    key: ObservabilityKey,
    configKey: string,
  ): Promise<HealthComponentResult> {
    const url = this.config.get<string>(configKey);
    if (!url) {
      return {
        key,
        status: 'disabled',
        required: false,
        weight: 0,
        latencyMs: 0,
      };
    }

    const startedAt = performance.now();
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(
          this.config.getOrThrow<number>('OBSERVABILITY_HEALTH_TIMEOUT_MS'),
        ),
      });
      return {
        key,
        status: response.ok ? 'up' : 'down',
        required: false,
        weight: 0,
        latencyMs: this.elapsed(startedAt),
        details: { httpStatus: response.status },
      };
    } catch {
      return {
        key,
        status: 'down',
        required: false,
        weight: 0,
        latencyMs: this.elapsed(startedAt),
      };
    }
  }

  private elapsed(startedAt: number): number {
    return Math.round((performance.now() - startedAt) * 100) / 100;
  }
}
