import {
  DateTimeValueObject,
  EmailValueObject,
  EntityIdValueObject,
  LoginValueObject,
} from '@shared/domain/value-objects';
import { Admin } from '../../domain/admin';
import { AdminRole, AdminStatus } from '../../domain/admin.types';
import type { AdminRecord } from './admin.schema';

export class AdminPersistenceMapper {
  static toDomain(record: AdminRecord): Admin {
    return Admin.restore({
      id: EntityIdValueObject.fromString(record.id),
      login: LoginValueObject.create(record.login),
      email: EmailValueObject.create(record.email),
      passwordHash: record.passwordHash,
      firstName: record.firstName,
      lastName: record.lastName,
      role: record.role as AdminRole,
      permissions: record.permissions,
      status: record.status as AdminStatus,
      tokenVersion: record.tokenVersion,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    });
  }
}
