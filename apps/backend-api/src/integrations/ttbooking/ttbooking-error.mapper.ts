import { HttpStatus, Injectable } from '@nestjs/common';
import { AppHttpException } from '@core/http/errors/app-http.exception';

export class TtbookingHttpError extends Error {
  constructor(readonly status: number) {
    super(`TTBooking HTTP ${status}`);
  }
}

@Injectable()
export class TtbookingErrorMapper {
  map(error: unknown): AppHttpException {
    if (this.isTimeout(error)) {
      return this.exception(
        HttpStatus.GATEWAY_TIMEOUT,
        'FLIGHT_PROVIDER_TIMEOUT',
      );
    }
    if (error instanceof TtbookingHttpError) {
      return this.mapHttpStatus(error.status);
    }
    return this.exception(
      HttpStatus.SERVICE_UNAVAILABLE,
      'FLIGHT_PROVIDER_UNAVAILABLE',
    );
  }

  unavailable(code = 'FLIGHT_PROVIDER_UNAVAILABLE'): AppHttpException {
    return this.exception(HttpStatus.SERVICE_UNAVAILABLE, code);
  }

  private mapHttpStatus(status: number): AppHttpException {
    if (status === 401 || status === 403) {
      return this.exception(
        HttpStatus.BAD_GATEWAY,
        'FLIGHT_PROVIDER_AUTH_FAILED',
      );
    }
    if (status === 429) {
      return this.exception(
        HttpStatus.SERVICE_UNAVAILABLE,
        'FLIGHT_PROVIDER_RATE_LIMITED',
      );
    }
    return this.unavailable();
  }

  private exception(status: number, code: string): AppHttpException {
    return new AppHttpException(status, code);
  }

  private isTimeout(error: unknown): boolean {
    return (
      error instanceof Error &&
      (error.name === 'AbortError' || error.name === 'TimeoutError')
    );
  }
}
