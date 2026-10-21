import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../contracts/api-response.contract';
import { RAW_RESPONSE_KEY } from '../decorators/raw-response.decorator';
import { createResponseMeta } from '../request/request-context';

@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, unknown>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    const raw = this.reflector.getAllAndOverride<boolean>(RAW_RESPONSE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (raw) return next.handle();

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (response.statusCode === 204) return data;
        const meta = createResponseMeta(request, response.statusCode);
        if (data instanceof PaginatedResult) {
          return {
            data: data.items,
            meta: { ...meta, pagination: data.pagination },
          };
        }
        return {
          data,
          meta,
        };
      }),
    );
  }
}
