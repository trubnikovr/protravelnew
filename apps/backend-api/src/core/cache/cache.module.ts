import { Module } from '@nestjs/common';
import { CacheManager } from './cache-manager';

@Module({ providers: [CacheManager], exports: [CacheManager] })
export class CacheModule {}
