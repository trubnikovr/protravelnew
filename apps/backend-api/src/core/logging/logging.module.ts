import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.getOrThrow<string>('LOG_LEVEL'),
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'req.body.password',
              'req.body.phone',
              'req.body.code',
              'req.body.accessToken',
              'req.body.refreshToken',
            ],
            censor: '[REDACTED]',
          },
          transport:
            config.get<string>('NODE_ENV') === 'development'
              ? { target: 'pino-pretty' }
              : undefined,
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
