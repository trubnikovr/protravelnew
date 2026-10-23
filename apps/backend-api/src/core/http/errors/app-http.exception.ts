import { HttpException } from '@nestjs/common';

export class AppHttpException extends HttpException {
  constructor(status: number, code: string, details: unknown = null) {
    super({ code, details }, status);
  }
}
