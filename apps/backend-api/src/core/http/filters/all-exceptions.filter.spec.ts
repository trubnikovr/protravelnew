import { BadRequestException, type ArgumentsHost } from '@nestjs/common';
import type { AppLogger } from '@core/logging/app-logger';
import type { ApiErrorResponse } from '../contracts/api-response.contract';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  it('returns the common error envelope', () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getRequest: () => ({
          id: 'request-1',
          originalUrl: '/api/v1/test',
          headers: {},
        }),
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;
    const logger = {
      setContext: jest.fn(),
      error: jest.fn(),
    } as unknown as AppLogger;
    const filter = new AllExceptionsFilter(logger);

    filter.catch(
      new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: ['email must be an email'],
      }),
      host,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledTimes(1);
    const calls = json.mock.calls as unknown[][];
    const body = calls[0]?.[0] as ApiErrorResponse;
    expect(body.error).toEqual({
      code: 'VALIDATION_FAILED',
      message: 'Request validation failed',
      details: { validationErrors: ['email must be an email'] },
    });
    expect(body.meta).toMatchObject({
      requestId: 'request-1',
      statusCode: 400,
    });
  });
});
