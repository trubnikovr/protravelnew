import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthClientService implements OnApplicationShutdown {
  private readonly client: Redis;
  private connecting: Promise<void> | null = null;

  constructor(config: ConfigService) {
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

  async ping(): Promise<string> {
    if (this.client.status === 'wait') {
      this.connecting ??= this.client.connect().finally(() => {
        this.connecting = null;
      });
      await this.connecting;
    }
    return this.client.ping();
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.client.status === 'ready') {
      await this.client.quit();
      return;
    }
    this.client.disconnect();
  }
}
