import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { APP_LOG_EVENT, type AppLogEvent } from './app-log.event';

@Injectable()
export class AppLogWriter {
  constructor(private readonly logger: PinoLogger) {}

  @OnEvent(APP_LOG_EVENT, { async: true })
  handle(event: AppLogEvent): void {
    const fields = { context: event.context, ...event.fields };
    this.logger[event.level](fields, event.message);
  }
}
