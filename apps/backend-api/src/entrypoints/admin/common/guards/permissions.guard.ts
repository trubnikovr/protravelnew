import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole, type AdminPermission } from '@modules/admin';
import type { Request } from 'express';
import type { AuthenticatedAdmin } from '../../auth/admin-auth.types';
import { ADMIN_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<AdminPermission[]>(
      ADMIN_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required?.length) {
      return true;
    }

    const admin = context.switchToHttp().getRequest<Request>()
      .user as AuthenticatedAdmin;
    if (admin.role === AdminRole.SUPER_ADMIN) {
      return true;
    }
    if (
      required.every((permission) => admin.permissions.includes(permission))
    ) {
      return true;
    }

    throw new ForbiddenException({
      code: 'ADMIN_PERMISSION_DENIED',
      message: 'Administrator does not have the required permission',
      requiredPermissions: required,
    });
  }
}
