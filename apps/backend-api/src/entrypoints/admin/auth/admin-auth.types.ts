import type { AdminPermission, AdminRole } from '@modules/admin';

export interface AdminJwtPayload {
  sub: string;
  login: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  tokenVersion: number;
  scope: 'admin';
}

export interface AuthenticatedAdmin {
  id: string;
  login: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
}
