import { ConfigService } from '@nestjs/config';
import { AdminService } from '@modules/admin';
import type { Admin } from '@modules/admin';
import { AdminPermission, AdminRole } from '@modules/admin';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import type { AdminJwtPayload } from './admin-auth.types';

describe('AdminJwtStrategy', () => {
  const admin = {
    id: { toString: () => '88b6aa4e-7e8e-4278-bfd2-b84abcd6c0f9' },
    login: { toString: () => 'admin' },
    email: { toString: () => 'admin@protravel.uz' },
    role: AdminRole.SUPER_ADMIN,
    permissions: Object.values(AdminPermission),
    tokenVersion: 3,
    isActive: () => true,
  } as unknown as Admin;

  const payload = (tokenVersion: number): AdminJwtPayload => ({
    sub: admin.id.toString(),
    login: admin.login.toString(),
    email: admin.email.toString(),
    role: admin.role,
    permissions: [...admin.permissions],
    tokenVersion,
    scope: 'admin',
  });

  const strategy = () =>
    new AdminJwtStrategy(
      {
        getOrThrow: jest.fn().mockReturnValue('a'.repeat(32)),
      } as unknown as ConfigService,
      {
        findById: jest.fn().mockResolvedValue(admin),
      } as unknown as AdminService,
    );

  it('accepts a token with the current version', async () => {
    await expect(strategy().validate(payload(3))).resolves.toMatchObject({
      id: admin.id.toString(),
      login: 'admin',
    });
  });

  it('rejects a token after the database version changes', async () => {
    await expect(strategy().validate(payload(2))).rejects.toMatchObject({
      response: { code: 'ADMIN_AUTH_INVALID_ACCESS_TOKEN' },
    });
  });
});
