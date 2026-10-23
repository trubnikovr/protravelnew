import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';
import { PinoLogger } from 'nestjs-pino';
import type { ApiErrorResponse } from '../contracts/api-response.contract';
import { errorMessage } from '../errors/error-message.catalog';
import { createResponseMeta } from '../request/request-context';
import { requestLocale } from '../request/request-locale';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload =
      exception instanceof HttpException ? exception.getResponse() : null;

    if (!(exception instanceof HttpException) || status >= 500) {
      this.logger.error(
        { err: exception, path: request.originalUrl },
        'Unhandled HTTP exception',
      );
      Sentry.captureException(exception);
    }

    const code = this.code(status, payload);
    const body: ApiErrorResponse = {
      error: {
        code,
        message: this.message(code, status, payload, request),
        details: this.details(status, payload),
      },
      meta: createResponseMeta(request, status),
    };
    response.status(status).json(body);
  }

  private code(status: number, payload: unknown): string {
    if (this.isObject(payload) && typeof payload.code === 'string') {
      return payload.code;
    }
    return `HTTP_${status}`;
  }

  private message(
    code: string,
    status: number,
    payload: unknown,
    request: Request,
  ): string {
    const localized = errorMessage(code, requestLocale(request));
    if (localized) return localized;
    if (this.isObject(payload) && 'message' in payload) {
      return Array.isArray(payload.message)
        ? 'Request validation failed'
        : String(payload.message);
    }
    return status === 500 ? 'Internal server error' : 'Request failed';
  }

  private details(status: number, payload: unknown): unknown {
    if (status >= 500) return null;
    if (!this.isObject(payload)) return null;
    if ('details' in payload) return payload.details;
    if (Array.isArray(payload.message)) {
      return { validationErrors: payload.message };
    }
    return null;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
