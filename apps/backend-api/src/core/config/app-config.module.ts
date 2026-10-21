import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ['apps/backend-api/.env', '.env'],
      validationSchema: envValidationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
