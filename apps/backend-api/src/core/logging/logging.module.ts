import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppLogger } from './app-logger';
import { AppLogWriter } from './app-log.writer';
import { HttpAccessLogInterceptor } from './http-access-log.interceptor';
import { DomainEventsModule } from '@core/events/domain-events.module';
import { LogContext } from './log-context';

@Global()
@Module({
  imports: [
    DomainEventsModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const development = config.get<string>('NODE_ENV') === 'development';
        return {
          pinoHttp: {
            autoLogging: false,
            level: config.getOrThrow<string>('LOG_LEVEL'),
            customSuccessMessage: (request, response, responseTime) =>
              `${request.method} ${request.url} ${response.statusCode} ${responseTime}ms`,
            customErrorMessage: (request, response, error) =>
              `${request.method} ${request.url} ${response.statusCode} ${error.message}`,
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
            transport: development
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    ignore: 'pid,hostname,req,res,responseTime',
                    singleLine: true,
                    translateTime: 'HH:MM:ss.l',
                  },
                }
              : undefined,
          },
        };
      },
    }),
  ],
  providers: [
    AppLogger,
    AppLogWriter,
    LogContext,
    { provide: APP_INTERCEPTOR, useClass: HttpAccessLogInterceptor },
  ],
  exports: [LoggerModule, AppLogger, LogContext],
})
export class LoggingModule {}
