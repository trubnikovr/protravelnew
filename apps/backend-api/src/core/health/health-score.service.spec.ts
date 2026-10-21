import type { ConfigService } from '@nestjs/config';
import type { Database } from '@core/database/database.types';
import type { RedisHealthClientService } from '@core/queue/redis-health-client.service';
import type { ObservabilityHealthService } from '@core/observability/observability-health.service';
import { HealthScoreService } from './health-score.service';

describe('HealthScoreService', () => {
  const config = {
    getOrThrow: jest.fn().mockReturnValue(100),
  } as unknown as ConfigService;
  const observability = {
    check: jest.fn().mockResolvedValue([]),
  } as unknown as ObservabilityHealthService;

  it('returns 100 when every component is available', async () => {
    const database = {
      execute: jest.fn().mockResolvedValue([]),
    } as unknown as Database;
    const redis = {
      ping: jest.fn().mockResolvedValue('PONG'),
    } as unknown as RedisHealthClientService;

    const result = await new HealthScoreService(
      database,
      redis,
      config,
      observability,
    ).calculate();

    expect(result.score).toBe(100);
    expect(result.status).toBe('healthy');
  });

  it('returns unhealthy when PostgreSQL and Redis are unavailable', async () => {
    const database = {
      execute: jest.fn().mockRejectedValue(new Error('database down')),
    } as unknown as Database;
    const redis = {
      ping: jest.fn().mockRejectedValue(new Error('redis down')),
    } as unknown as RedisHealthClientService;

    const result = await new HealthScoreService(
      database,
      redis,
      config,
      observability,
    ).calculate();

    expect(result.score).toBe(40);
    expect(result.status).toBe('unhealthy');
  });
});
