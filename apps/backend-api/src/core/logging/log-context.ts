import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';

export type LogActorType = 'customer' | 'admin';

export interface LogContextFields {
  trace_id?: string;
  span_id?: string;
  requestId?: string;
  userId?: string;
  actorType?: LogActorType;
}

@Injectable()
export class LogContext {
  private readonly storage = new AsyncLocalStorage<LogContextFields>();

  run<T>(fields: LogContextFields, callback: () => T): T {
    return this.storage.run(fields, callback);
  }

  current(): LogContextFields {
    return this.storage.getStore() ?? {};
  }
}
