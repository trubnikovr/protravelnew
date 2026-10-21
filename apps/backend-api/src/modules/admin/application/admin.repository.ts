import type { Admin } from '../domain/admin';
import type {
  EntityIdValueObject,
  LoginValueObject,
} from '@shared/domain/value-objects';

export const ADMIN_REPOSITORY = Symbol('ADMIN_REPOSITORY');

export interface AdminRepository {
  findById(id: EntityIdValueObject): Promise<Admin | null>;
  findByLogin(login: LoginValueObject): Promise<Admin | null>;
  incrementTokenVersion(id: EntityIdValueObject): Promise<number | null>;
}
