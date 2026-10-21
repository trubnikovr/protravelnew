import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { performance } from 'node:perf_hooks';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import { RedisHealthClientService } from '@core/queue/redis-health-client.service';
import { ObservabilityHealthService } from '@core/observability/observability-health.service';
import { DateTimeValueObject } from '@shared/domain/value-objects';
import type {
  HealthComponentResult,
  SystemHealthScore,
  SystemHealthStatus,
} from './health-score.types';

const CHECK_TIMEOUT_MS = 1_500;

@Injectable()
export class HealthScoreService {
  constructor(
    @Inject(DRIZZLE_DB) private readonly database: Database,
    private readonly redis: RedisHealthClientService,
    private readonly config: ConfigService,
    private readonly observability: ObservabilityHealthService,
  ) {}

  async calculate(): Promise<SystemHealthScore> {
    const [requiredComponents, observabilityComponents] = await Promise.all([
      Promise.all([
        this.measure('application', 10, () => ({ running: true })),
        this.measure('database', 35, async () => {
          await this.database.execute(sql`select 1`);
          return { connected: true };
        }),
        this.measure('redis', 25, async () => ({
          response: await this.redis.ping(),
        })),
        this.measure('memory', 20, () => this.checkMemory()),
        this.measure('eventLoop', 10, async () => this.checkEventLoop()),
      ]),
      this.observability.check(),
    ]);
    const score = requiredComponents.reduce(
      (total, component) =>
        total + (component.status === 'up' ? component.weight : 0),
      0,
    );
    const components = [...requiredComponents, ...observabilityComponents];

    return {
      status: this.resolveStatus(score),
      score,
      checkedAt: DateTimeValueObject.now().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      components,
    };
  }

  private async measure(
    key: HealthComponentResult['key'],
    weight: number,
    check: () =>
      | Record<string, string | number | boolean>
      | Promise<Record<string, string | number | boolean>>,
  ): Promise<HealthComponentResult> {
    const startedAt = performance.now();
    let timeout: NodeJS.Timeout | undefined;
    try {
      const details = await Promise.race([
        Promise.resolve(check()),
        new Promise<never>(
          (_resolve, reject) =>
            (timeout = setTimeout(
              () => reject(new Error('Health check timed out')),
              CHECK_TIMEOUT_MS,
            )),
        ),
      ]);
      return {
        key,
        status: 'up',
        required: true,
        weight,
        latencyMs: this.elapsed(startedAt),
        details,
      };
    } catch {
      return {
        key,
        status: 'down',
        required: true,
        weight,
        latencyMs: this.elapsed(startedAt),
      };
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  private checkMemory(): Record<string, number | boolean> {
    const memory = process.memoryUsage();
    const usagePercent = (memory.heapUsed / memory.heapTotal) * 100;
    const threshold = this.config.getOrThrow<number>('HEALTH_MAX_HEAP_PERCENT');
    if (usagePercent > threshold) {
      throw new Error('Heap usage threshold exceeded');
    }
    return {
      usagePercent: Math.round(usagePercent * 100) / 100,
      thresholdPercent: threshold,
      healthy: true,
    };
  }

  private async checkEventLoop(): Promise<Record<string, number | boolean>> {
    const startedAt = performance.now();
    await new Promise<void>((resolve) => setImmediate(resolve));
    const lagMs = this.elapsed(startedAt);
    if (lagMs > 200) {
      throw new Error('Event loop lag threshold exceeded');
    }
    return { lagMs, thresholdMs: 200, healthy: true };
  }

  private resolveStatus(score: number): SystemHealthStatus {
    if (score >= 90) return 'healthy';
    if (score >= 60) return 'degraded';
    return 'unhealthy';
  }

  private elapsed(startedAt: number): number {
    return Math.round((performance.now() - startedAt) * 100) / 100;
  }
}
