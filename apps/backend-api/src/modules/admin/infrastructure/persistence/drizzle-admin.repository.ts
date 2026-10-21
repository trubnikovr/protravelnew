import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import type {
  EntityIdValueObject,
  LoginValueObject,
} from '@shared/domain/value-objects';
import type { AdminRepository } from '../../application/admin.repository';
import type { Admin } from '../../domain/admin';
import { AdminPersistenceMapper } from './admin-persistence.mapper';
import { admins } from './admin.schema';

@Injectable()
export class DrizzleAdminRepository implements AdminRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async findById(id: EntityIdValueObject): Promise<Admin | null> {
    const [record] = await this.database
      .select()
      .from(admins)
      .where(eq(admins.id, id.toString()))
      .limit(1);
    return record ? AdminPersistenceMapper.toDomain(record) : null;
  }

  async findByLogin(login: LoginValueObject): Promise<Admin | null> {
    const [record] = await this.database
      .select()
      .from(admins)
      .where(eq(admins.login, login.toString()))
      .limit(1);
    return record ? AdminPersistenceMapper.toDomain(record) : null;
  }

  async incrementTokenVersion(id: EntityIdValueObject): Promise<number | null> {
    const [record] = await this.database
      .update(admins)
      .set({
        tokenVersion: sql`${admins.tokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, id.toString()))
      .returning({ tokenVersion: admins.tokenVersion });
    return record?.tokenVersion ?? null;
  }
}
