import {
  DateTimeValueObject,
  EmailValueObject,
  EntityIdValueObject,
  LoginValueObject,
} from '@shared/domain/value-objects';
import { Admin } from './admin';
import { AdminPermission, AdminRole, AdminStatus } from './admin.types';

describe('Admin domain', () => {
  const restore = (role: AdminRole, permissions: AdminPermission[]) =>
    Admin.restore({
      id: EntityIdValueObject.create(),
      login: LoginValueObject.create('admin'),
      email: EmailValueObject.create('admin@protravel.uz'),
      passwordHash: 'hash',
      firstName: 'Admin',
      lastName: null,
      role,
      permissions,
      status: AdminStatus.ACTIVE,
      tokenVersion: 0,
      createdAt: DateTimeValueObject.now(),
      updatedAt: DateTimeValueObject.now(),
    });

  it('grants explicitly assigned permissions', () => {
    expect(
      restore(AdminRole.ADMIN, [AdminPermission.USERS_READ]).hasPermission(
        AdminPermission.USERS_READ,
      ),
    ).toBe(true);
  });

  it('allows super-admin to bypass permission restrictions', () => {
    const admin = restore(AdminRole.SUPER_ADMIN, []);

    expect(admin.isSuperAdmin).toBe(true);
    expect(admin.hasPermission(AdminPermission.PAYMENTS_REFUND)).toBe(true);
    expect(admin.permissions).toEqual(Object.values(AdminPermission));
  });

  it('does not mark a regular administrator as super-admin', () => {
    expect(restore(AdminRole.ADMIN, []).isSuperAdmin).toBe(false);
  });
});
