import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import {
  airports,
  countries,
} from '@core/submodules/reference/infrastructure/persistence/reference.schema';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import type {
  TravelFactsRepository,
  TravelFactUpdateData,
  TravelFactWriteData,
} from '../../application/travel-facts.repository';
import { TravelFact } from '../../domain/travel-fact';
import { travelFacts, type TravelFactRecord } from './travel-fact.schema';

@Injectable()
export class DrizzleTravelFactsRepository implements TravelFactsRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async listAll(): Promise<TravelFact[]> {
    const records = await this.database
      .select()
      .from(travelFacts)
      .orderBy(desc(travelFacts.updatedAt), desc(travelFacts.id));
    return records.map((record) => this.toDomain(record));
  }

  async create(data: TravelFactWriteData): Promise<TravelFact> {
    const [record] = await this.database
      .insert(travelFacts)
      .values({
        text: data.text.trim(),
        countryCode: data.countryCode?.trim().toUpperCase() || null,
        destinationCode: data.destinationCode?.trim().toUpperCase() || null,
        tags: data.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean),
        isPublished: data.isPublished,
      })
      .returning();
    return this.toDomain(record);
  }

  async update(id: string, data: TravelFactUpdateData) {
    const [record] = await this.database
      .update(travelFacts)
      .set({ ...this.normalize(data), updatedAt: new Date() })
      .where(eq(travelFacts.id, id))
      .returning();
    return record ? this.toDomain(record) : null;
  }

  async delete(id: string): Promise<boolean> {
    const records = await this.database
      .delete(travelFacts)
      .where(eq(travelFacts.id, id))
      .returning({ id: travelFacts.id });
    return records.length > 0;
  }

  async randomPublished(destinationCode?: string) {
    const [fact] = await this.randomPublishedMany(destinationCode, 1);
    return fact ?? null;
  }

  async randomPublishedMany(
    destinationCode: string | undefined,
    limit: number,
  ) {
    const countryCode = await this.countryCode(destinationCode);
    const records = await this.randomFromBestScope(
      destinationCode,
      countryCode,
      limit,
    );
    return records.map((record) => this.toDomain(record));
  }

  private async randomFromBestScope(
    destinationCode: string | undefined,
    countryCode: string | null,
    limit: number,
  ): Promise<TravelFactRecord[]> {
    for (const scope of this.factScopes(destinationCode, countryCode)) {
      const records = await this.database
        .select()
        .from(travelFacts)
        .where(and(eq(travelFacts.isPublished, true), scope))
        .orderBy(sql`random()`)
        .limit(limit);
      if (records.length > 0) return records;
    }
    return [];
  }

  private factScopes(destinationCode?: string, countryCode?: string | null) {
    return [
      destinationCode
        ? eq(travelFacts.destinationCode, destinationCode)
        : undefined,
      countryCode
        ? and(
            eq(travelFacts.countryCode, countryCode),
            sql`${travelFacts.destinationCode} is null`,
          )
        : undefined,
      sql`${travelFacts.countryCode} is null and ${travelFacts.destinationCode} is null`,
    ].filter((scope) => scope !== undefined);
  }

  private async countryCode(destinationCode?: string) {
    if (!destinationCode) return null;
    const [result] = await this.database
      .select({ code: countries.isoCode })
      .from(airports)
      .innerJoin(countries, eq(countries.id, airports.countryId))
      .where(eq(airports.iataCode, destinationCode))
      .limit(1);
    return result?.code ?? null;
  }

  private normalize(data: TravelFactUpdateData) {
    return {
      ...(data.text === undefined ? {} : { text: data.text.trim() }),
      ...(data.countryCode === undefined
        ? {}
        : { countryCode: data.countryCode?.trim().toUpperCase() || null }),
      ...(data.destinationCode === undefined
        ? {}
        : {
            destinationCode: data.destinationCode?.trim().toUpperCase() || null,
          }),
      ...(data.tags === undefined
        ? {}
        : {
            tags: data.tags
              .map((tag) => tag.trim().toLowerCase())
              .filter(Boolean),
          }),
      ...(data.isPublished === undefined
        ? {}
        : { isPublished: data.isPublished }),
    };
  }

  private toDomain(record: TravelFactRecord): TravelFact {
    return TravelFact.restore({
      id: EntityIdValueObject.fromString(record.id),
      text: record.text,
      countryCode: record.countryCode,
      destinationCode: record.destinationCode,
      tags: record.tags,
      isPublished: record.isPublished,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    });
  }
}
