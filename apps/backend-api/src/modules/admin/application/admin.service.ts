import { Inject, Injectable } from '@nestjs/common';
import { verify } from 'argon2';
import {
  EntityIdValueObject,
  LoginValueObject,
} from '@shared/domain/value-objects';
import type { Admin } from '../domain/admin';
import { ADMIN_REPOSITORY, type AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly repository: AdminRepository,
  ) {}

  findById(id: string): Promise<Admin | null> {
    return this.repository.findById(EntityIdValueObject.fromString(id));
  }

  revokeAllSessions(id: string): Promise<number | null> {
    return this.repository.incrementTokenVersion(
      EntityIdValueObject.fromString(id),
    );
  }

  async authenticate(login: string, password: string): Promise<Admin | null> {
    const admin = await this.repository.findByLogin(
      LoginValueObject.create(login),
    );

    if (
      !admin ||
      !admin.isActive() ||
      !(await verify(admin.passwordHash, password))
    ) {
      return null;
    }

    return admin;
  }
}
