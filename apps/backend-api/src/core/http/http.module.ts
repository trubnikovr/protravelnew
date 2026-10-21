import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingModule } from '@core/logging/logging.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ResponseEnvelopeInterceptor } from './interceptors/response-envelope.interceptor';

@Global()
@Module({
  imports: [LoggingModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseEnvelopeInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class HttpModule {}
