import type { CallHandler, ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { ResponseEnvelopeInterceptor } from './response-envelope.interceptor';

describe('ResponseEnvelopeInterceptor', () => {
  it('wraps successful data with common metadata', async () => {
    const request = {
      id: 'request-1',
      originalUrl: '/api/v1/admin/me',
    };
    const response = { statusCode: 200 };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const next = { handle: () => of({ id: 'admin-1' }) } as CallHandler;

    const result = await firstValueFrom(
      new ResponseEnvelopeInterceptor(reflector).intercept(context, next),
    );

    expect(result).toMatchObject({
      data: { id: 'admin-1' },
      meta: {
        path: '/api/v1/admin/me',
        statusCode: 200,
        requestId: 'request-1',
      },
    });
  });
});
