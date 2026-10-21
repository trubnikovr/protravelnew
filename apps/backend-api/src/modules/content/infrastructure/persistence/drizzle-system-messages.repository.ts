import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import type {
  SystemMessagesRepository,
  SystemMessageUpdateData,
  SystemMessageWriteData,
} from '../../application/system-messages.repository';
import { SystemMessage } from '../../domain/system-message';
import {
  systemMessages,
  type SystemMessageRecord,
} from './system-message.schema';

@Injectable()
export class DrizzleSystemMessagesRepository
  implements SystemMessagesRepository
{
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async listActive(): Promise<SystemMessage[]> {
    const records = await this.database
      .select()
      .from(systemMessages)
      .where(eq(systemMessages.isActive, true))
      .orderBy(desc(systemMessages.updatedAt), desc(systemMessages.id));
    return records.map(this.toDomain);
  }

  async listAll(): Promise<SystemMessage[]> {
    const records = await this.database
      .select()
      .from(systemMessages)
      .orderBy(desc(systemMessages.updatedAt), desc(systemMessages.id));
    return records.map(this.toDomain);
  }

  async create(data: SystemMessageWriteData): Promise<SystemMessage> {
    const [record] = await this.database
      .insert(systemMessages)
      .values(data)
      .returning();
    return this.toDomain(record);
  }

  async update(id: string, data: SystemMessageUpdateData) {
    const [record] = await this.database
      .update(systemMessages)
      .set({...data, updatedAt: new Date()})
      .where(eq(systemMessages.id, id))
      .returning();
    return record ? this.toDomain(record) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.database
      .delete(systemMessages)
      .where(eq(systemMessages.id, id))
      .returning({id: systemMessages.id});
    return deleted.length > 0;
  }

  private toDomain = (record: SystemMessageRecord): SystemMessage =>
    SystemMessage.restore({
      id: EntityIdValueObject.fromString(record.id),
      text: record.text,
      type: record.type,
      isActive: record.isActive,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    });
}
