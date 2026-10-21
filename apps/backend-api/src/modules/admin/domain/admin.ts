import {
  EmailValueObject,
  LoginValueObject,
} from '@shared/domain/value-objects';
import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import { AdminPermission, AdminRole, AdminStatus } from './admin.types';

export interface AdminProperties extends DomainEntityProperties {
  login: LoginValueObject;
  email: EmailValueObject;
  passwordHash: string;
  firstName: string;
  lastName: string | null;
  role: AdminRole;
  permissions: AdminPermission[];
  status: AdminStatus;
  tokenVersion: number;
}

export class Admin extends DomainEntity<AdminProperties> {
  private constructor(private readonly properties: AdminProperties) {
    super(properties);
  }

  static restore(properties: AdminProperties): Admin {
    return new Admin({
      ...properties,
      permissions: [...properties.permissions],
    });
  }

  get email(): EmailValueObject {
    return this.properties.email;
  }

  get login(): LoginValueObject {
    return this.properties.login;
  }

  get firstName(): string {
    return this.properties.firstName;
  }

  get lastName(): string | null {
    return this.properties.lastName;
  }

  get role(): AdminRole {
    return this.properties.role;
  }

  get permissions(): readonly AdminPermission[] {
    if (this.isSuperAdmin) {
      return Object.values(AdminPermission);
    }
    return [...this.properties.permissions];
  }

  get isSuperAdmin(): boolean {
    return this.role === AdminRole.SUPER_ADMIN;
  }

  get status(): AdminStatus {
    return this.properties.status;
  }

  get tokenVersion(): number {
    return this.properties.tokenVersion;
  }

  get passwordHash(): string {
    return this.properties.passwordHash;
  }

  isActive(): boolean {
    return this.status === AdminStatus.ACTIVE;
  }

  hasPermission(permission: AdminPermission): boolean {
    return (
      this.isSuperAdmin || this.properties.permissions.includes(permission)
    );
  }
}
