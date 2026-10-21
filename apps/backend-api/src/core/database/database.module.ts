import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE_DB, POSTGRES_POOL } from './database.constants';
import { DatabaseLifecycleService } from './database-lifecycle.service';
import * as schema from './schema';

@Global()
@Module({
  providers: [
    {
      provide: POSTGRES_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Pool =>
        new Pool({
          host: config.getOrThrow<string>('DATABASE_HOST'),
          port: config.getOrThrow<number>('DATABASE_PORT'),
          database: config.getOrThrow<string>('DATABASE_NAME'),
          user: config.getOrThrow<string>('DATABASE_USER'),
          password: config.getOrThrow<string>('DATABASE_PASSWORD'),
          ssl: config.getOrThrow<boolean>('DATABASE_SSL')
            ? { rejectUnauthorized: false }
            : false,
          max: 20,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 5_000,
        }),
    },
    {
      provide: DRIZZLE_DB,
      inject: [POSTGRES_POOL],
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
    },
    DatabaseLifecycleService,
  ],
  exports: [DRIZZLE_DB, POSTGRES_POOL],
})
export class DatabaseModule {}
