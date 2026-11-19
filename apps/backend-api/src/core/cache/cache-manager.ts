import { HttpStatus, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { AppHttpException } from '@core/http/errors/app-http.exception';
import { AppLogger } from '@core/logging/app-logger';

const RENEW =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('pexpire', KEYS[1], ARGV[2]) else return 0 end";
const RELEASE =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
const STORE =
  "if redis.call('get', KEYS[1]) == ARGV[1] then redis.call('set', KEYS[2], ARGV[2], 'PX', ARGV[3]); return redis.call('del', KEYS[1]) else return 0 end";
const LOCK_MS = 30_000;
const WAIT_MS = 15 * 60_000;

@Injectable()
export class CacheManager implements OnApplicationShutdown {
  private readonly client: Redis;
  private readonly pending = new Map<string, Promise<unknown>>();
  private connecting: Promise<void> | null = null;

  constructor(config: ConfigService, private readonly logger: AppLogger) {
    this.client = new Redis({
      host: config.getOrThrow<string>('REDIS_HOST'),
      port: config.getOrThrow<number>('REDIS_PORT'),
      password: config.get<string>('REDIS_PASSWORD') || undefined,
      lazyConnect: true,
      connectTimeout: 1_500,
      commandTimeout: 1_500,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: (attempt) => Math.min(attempt * 500, 5_000),
    });
    this.client.on('error', () => undefined);
  }

  async getOrLoad<T>(
    key: string,
    load: () => Promise<T>,
    ttlMs: (value: T) => number,
  ): Promise<T> {
    const current = this.pending.get(key) as Promise<T> | undefined;
    if (current) return current;
    const work = this.coordinatedLoad(key, load, ttlMs);
    this.pending.set(key, work);
    try {
      return await work;
    } finally {
      this.pending.delete(key);
    }
  }

  private async coordinatedLoad<T>(
    key: string,
    load: () => Promise<T>,
    ttlMs: (value: T) => number,
  ): Promise<T> {
    const deadline = Date.now() + WAIT_MS;
    while (Date.now() < deadline) {
      const step = await this.tryReadOrLock<T>(key);
      if (step.kind === 'cached') return step.value;
      if (step.kind === 'unavailable') return load();
      if (step.kind === 'owner')
        return this.loadOwned(key, step.token, load, ttlMs);
      await delay(250 + Math.floor(Math.random() * 100));
    }
    throw new AppHttpException(
      HttpStatus.SERVICE_UNAVAILABLE,
      'CACHE_WAIT_TIMEOUT',
    );
  }

  private async tryReadOrLock<T>(
    key: string,
  ): Promise<
    | { kind: 'cached'; value: T }
    | { kind: 'owner'; token: string }
    | { kind: 'wait' | 'unavailable' }
  > {
    try {
      await this.connect();
      const cached = await this.client.get(key);
      if (cached !== null)
        return { kind: 'cached', value: JSON.parse(cached) as T };
      const token = randomUUID();
      const locked = await this.client.set(
        `${key}:lock`,
        token,
        'PX',
        LOCK_MS,
        'NX',
      );
      if (!locked) return { kind: 'wait' };
      const afterLock = await this.client.get(key);
      if (afterLock !== null) {
        await this.client.eval(RELEASE, 1, `${key}:lock`, token);
        return { kind: 'cached', value: JSON.parse(afterLock) as T };
      }
      return { kind: 'owner', token };
    } catch {
      this.logger.warn(
        'Redis cache unavailable; running loader without distributed lock',
      );
      return { kind: 'unavailable' };
    }
  }

  private async loadOwned<T>(
    key: string,
    token: string,
    load: () => Promise<T>,
    ttlMs: (value: T) => number,
  ): Promise<T> {
    const lock = `${key}:lock`;
    const renewal = setInterval(() => {
      void this.client
        .eval(RENEW, 1, lock, token, LOCK_MS)
        .catch(() => undefined);
    }, LOCK_MS / 3);
    renewal.unref();
    try {
      const value = await load();
      await this.store(lock, key, token, value, ttlMs(value));
      return value;
    } finally {
      clearInterval(renewal);
      await this.release(lock, token);
    }
  }

  private async store<T>(
    lock: string,
    key: string,
    token: string,
    value: T,
    ttlMs: number,
  ): Promise<void> {
    try {
      await this.client.eval(
        STORE,
        2,
        lock,
        key,
        token,
        JSON.stringify(value),
        ttlMs,
      );
    } catch {
      this.logger.warn('Redis cache write failed');
    }
  }

  private async release(lock: string, token: string): Promise<void> {
    try {
      await this.client.eval(RELEASE, 1, lock, token);
    } catch {
      this.logger.warn('Redis cache lock release failed');
    }
  }

  private async connect(): Promise<void> {
    if (this.connecting) return this.connecting;
    if (this.client.status !== 'wait' && this.client.status !== 'end') return;
    this.connecting = this.client.connect().finally(() => {
      this.connecting = null;
    });
    await this.connecting;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.client.status === 'ready') await this.client.quit();
    else this.client.disconnect();
  }
}
