import { Injectable, Scope } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  APP_LOG_EVENT,
  type AppLogEvent,
  type AppLogLevel,
} from './app-log.event';
import { LogContext } from './log-context';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private context = 'Application';

  constructor(
    private readonly events: EventEmitter2,
    private readonly logContext: LogContext,
  ) {}

  setContext(context: string): void {
    this.context = context;
  }

  debug(fields: Record<string, unknown>, message: string): void {
    this.publish('debug', fields, message);
  }

  info(fields: Record<string, unknown>, message: string): void {
    this.publish('info', fields, message);
  }

  warn(message: string, fields: Record<string, unknown> = {}): void {
    this.publish('warn', fields, message);
  }

  error(fields: Record<string, unknown>, message: string): void {
    this.publish('error', fields, message);
  }

  private publish(
    level: AppLogLevel,
    fields: Record<string, unknown>,
    message: string,
  ): void {
    const event: AppLogEvent = {
      level,
      context: this.context,
      fields: { ...fields, ...this.logContext.current() },
      message,
    };
    this.events.emit(APP_LOG_EVENT, event);
  }
}
