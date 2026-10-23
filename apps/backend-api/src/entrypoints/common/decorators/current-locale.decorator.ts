import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { requestLocale } from '@core/http/request/request-locale';
import { SupportedLocale } from '@shared/domain/enums';

export const CurrentLocale = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SupportedLocale =>
    requestLocale(context.switchToHttp().getRequest<Request>()),
);
