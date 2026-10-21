import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import type { Pool } from 'pg';
import { POSTGRES_POOL } from './database.constants';

@Injectable()
export class DatabaseLifecycleService implements OnApplicationShutdown {
  constructor(@Inject(POSTGRES_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
