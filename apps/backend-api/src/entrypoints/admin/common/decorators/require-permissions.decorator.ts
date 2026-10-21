import { SetMetadata } from '@nestjs/common';
import type { AdminPermission } from '@modules/admin';

export const ADMIN_PERMISSIONS_KEY = 'admin_permissions';

export const RequirePermissions = (...permissions: AdminPermission[]) =>
  SetMetadata(ADMIN_PERMISSIONS_KEY, permissions);
