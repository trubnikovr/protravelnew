import { context, trace } from '@opentelemetry/api';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import { DateTimeValueObject } from '@shared/domain/value-objects';
import type { ApiResponseMeta } from '../contracts/api-response.contract';

export function getTraceId(): string | undefined {
  return getActiveSpanContext()?.traceId;
}

export function getActiveSpanContext():
  { traceId: string; spanId: string } | undefined {
  const spanContext = trace.getSpan(context.active())?.spanContext();
  if (!spanContext) return undefined;
  return { traceId: spanContext.traceId, spanId: spanContext.spanId };
}

export function createResponseMeta(
  request: Request,
  statusCode: number,
): ApiResponseMeta {
  const requestId =
    typeof request.id === 'string' || typeof request.id === 'number'
      ? String(request.id)
      : randomUUID();
  request.id = requestId;
  const traceId = getTraceId();
  return {
    timestamp: DateTimeValueObject.now().toISOString(),
    path: request.originalUrl,
    statusCode,
    requestId,
    ...(traceId ? { traceId } : {}),
  };
}
