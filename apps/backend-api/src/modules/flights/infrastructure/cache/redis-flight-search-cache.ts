import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { FlightSearchCachePort } from '../../application/ports/flight-search-cache.port';
import type { FlightOfferData } from '../../domain';
import { AppLogger } from '@core/logging/app-logger';

@Injectable()
export class RedisFlightSearchCache
  implements FlightSearchCachePort, OnApplicationShutdown
{
  private readonly client: Redis;
  private connecting: Promise<void> | null = null;

  constructor(
    config: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(RedisFlightSearchCache.name);
    this.client = new Redis({
      host: config.getOrThrow<string>('REDIS_HOST'),
      port: config.getOrThrow<number>('REDIS_PORT'),
      password: config.get<string>('REDIS_PASSWORD') || undefined,
      lazyConnect: true,
      connectTimeout: 1_500,
      commandTimeout: 1_500,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });
  }

  async get(key: string): Promise<FlightOfferData[] | null> {
    try {
      await this.ensureConnected();
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as FlightOfferData[]) : null;
    } catch {
      this.logger.warn('Flight search cache read failed; bypassing cache');
      return null;
    }
  }

  async set(
    key: string,
    offers: FlightOfferData[],
    ttlSeconds: number,
  ): Promise<void> {
    try {
      await this.ensureConnected();
      await this.client.set(key, JSON.stringify(offers), 'EX', ttlSeconds);
    } catch {
      this.logger.warn('Flight search cache write failed; bypassing cache');
    }
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.client.status === 'ready') {
      await this.client.quit();
      return;
    }
    this.client.disconnect();
  }

  private async ensureConnected(): Promise<void> {
    if (this.client.status !== 'wait') return;
    this.connecting ??= this.client.connect().finally(() => {
      this.connecting = null;
    });
    await this.connecting;
  }
}
