import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedAdmin } from '../../auth/admin-auth.types';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedAdmin =>
    context.switchToHttp().getRequest<Request>().user as AuthenticatedAdmin,
);
