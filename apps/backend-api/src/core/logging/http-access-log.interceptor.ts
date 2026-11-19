import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { randomUUID } from 'node:crypto';
import { AppLogger } from './app-logger';
import {
  LogContext,
  type LogActorType,
  type LogContextFields,
} from './log-context';
import { getActiveSpanContext } from '@core/http/request/request-context';

type AuthenticatedActor = { id?: unknown; role?: unknown };

function safeRequestUrl(url: string): string {
  return url.replace(/(\/flights\/shares\/)[^/?#]+/g, '$1[redacted]');
}

function operationDescription(method: string, url: string): string | undefined {
  if (method === 'POST' && ['/api/v1/flight-orders', '/api/v1/flight-orders/create-flight-order'].includes(url.split('?')[0])) {
    return 'Book flight and create order';
  }
  return undefined;
}

@Injectable()
export class HttpAccessLogInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLogger,
    private readonly logContext: LogContext,
  ) {
    this.logger.setContext(HttpAccessLogInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const fields = this.createContext(request);
    return new Observable((subscriber) =>
      this.logContext.run(fields, () => {
        this.registerAccessLog(request, response, fields);
        return next.handle().subscribe(subscriber);
      }),
    );
  }

  private createContext(request: Request): LogContextFields {
    const existingRequestId = request.id;
    const requestId =
      typeof existingRequestId === 'string' ||
      typeof existingRequestId === 'number'
        ? String(existingRequestId)
        : randomUUID();
    request.id = requestId;
    const span = getActiveSpanContext();
    const actor: AuthenticatedActor | undefined = request.user;
    const userId = typeof actor?.id === 'string' ? actor.id : undefined;
    const actorType = userId && actor ? this.actorType(actor) : undefined;
    return {
      requestId,
      ...(span ? { trace_id: span.traceId, span_id: span.spanId } : {}),
      ...(userId ? { userId, actorType } : {}),
    };
  }

  private actorType(actor: AuthenticatedActor): LogActorType {
    return actor.role === undefined ? 'customer' : 'admin';
  }

  private registerAccessLog(
    request: Request,
    response: Response,
    context: LogContextFields,
  ): void {
    const startedAt = performance.now();
    response.once('finish', () => {
      const responseTime = Math.round(performance.now() - startedAt);
      const url = safeRequestUrl(request.originalUrl);
      const operation = operationDescription(request.method, url);
      this.logger.info(
        {
          ...context,
          ...(operation ? { operation } : {}),
          method: request.method,
          url,
          statusCode: response.statusCode,
          responseTime,
          remoteAddress: request.ip,
          userAgent: request.headers['user-agent'],
        },
        `${operation ? `${operation} — ` : ''}${request.method} ${url} ${
          response.statusCode
        } ${responseTime}ms`,
      );
    });
  }
}
