import { EventEmitter } from 'node:events';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import type { AppLogger } from './app-logger';
import { HttpAccessLogInterceptor } from './http-access-log.interceptor';
import { LogContext, type LogContextFields } from './log-context';

describe('HttpAccessLogInterceptor', () => {
  it('makes verified request identity available to application logs', (done) => {
    const info = jest.fn();
    const logger = { setContext: jest.fn(), info } as unknown as AppLogger;
    const logContext = new LogContext();
    const interceptor = new HttpAccessLogInterceptor(logger, logContext);
    const request = {
      id: 'request-1',
      method: 'POST',
      originalUrl: '/api/v1/flights/searches',
      ip: '127.0.0.1',
      headers: {},
      user: { id: 'customer-1' },
    } as unknown as Request;
    const response = Object.assign(new EventEmitter(), {
      statusCode: 200,
    }) as unknown as Response;
    const execution = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
    let applicationContext: LogContextFields | undefined;
    const next = {
      handle: () =>
        new Observable((subscriber) => {
          applicationContext = logContext.current();
          subscriber.complete();
        }),
    } as CallHandler;

    interceptor.intercept(execution, next).subscribe({
      complete: () => {
        expect(applicationContext).toMatchObject({
          requestId: 'request-1',
          userId: 'customer-1',
          actorType: 'customer',
        });
        response.emit('finish');
        expect(info).toHaveBeenCalledWith(
          expect.objectContaining({
            requestId: 'request-1',
            userId: 'customer-1',
            actorType: 'customer',
          }),
          expect.stringContaining('POST /api/v1/flights/searches 200'),
        );
        done();
      },
    });
  });
});
