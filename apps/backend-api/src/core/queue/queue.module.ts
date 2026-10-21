import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisHealthClientService } from './redis-health-client.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: config.getOrThrow<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
        prefix: 'protravel',
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential' as const, delay: 1_000 },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      }),
    }),
  ],
  providers: [RedisHealthClientService],
  exports: [BullModule, RedisHealthClientService],
})
export class QueueModule {}
