import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  or,
  sql,
} from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import { SupportedLocale } from '@shared/domain/enums';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import { ReferenceCountry } from '../domain/reference-country';
import {
  airports,
  cities,
  countries,
  featuredFlightLocations,
} from '../infrastructure/persistence/reference.schema';

export interface ReferenceCountryListInput {
  page: number;
  limit: number;
  search?: string;
  locale: SupportedLocale;
  sortBy: 'name' | 'code';
  sortDirection: 'asc' | 'desc';
}

export type ReferenceSuggestionType = 'country' | 'city' | 'airport';

export interface ReferenceSuggestion {
  type: ReferenceSuggestionType;
  id: string;
  code: string | null;
  name: string;
  countryId: string;
  countryCode: string | null;
  countryName: string;
  cityId: string | null;
}

export interface ReferenceSuggestInput {
  query: string;
  types: ReferenceSuggestionType[];
  countryId?: string;
  limit: number;
}

export interface FeaturedFlightLocation {
  code: string;
  name: string;
  countryName: string;
  sortOrder: number;
  isActive: boolean;
}

@Injectable()
export class ReferenceService {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async listCountries(
    input: ReferenceCountryListInput,
  ): Promise<{ items: ReferenceCountry[]; total: number }> {
    const search = input.search?.trim();
    const localizedName = countries.nameRu;
    const sortColumn =
      input.sortBy === 'code' ? countries.isoCode : localizedName;
    const where = search
      ? and(
          isNotNull(countries.isoCode),
          or(
            ilike(countries.isoCode, `${search}%`),
            ilike(countries.nameRu, `%${search}%`),
            ilike(countries.nameUz, `%${search}%`),
            ilike(countries.nameEn, `%${search}%`),
          ),
        )
      : isNotNull(countries.isoCode);

    const [totalRecord] = await this.database
      .select({ value: count() })
      .from(countries)
      .where(where);

    const records = await this.database
      .select()
      .from(countries)
      .where(where)
      .orderBy(
        input.sortDirection === 'asc' ? asc(sortColumn) : desc(sortColumn),
        asc(countries.isoCode),
      )
      .limit(input.limit)
      .offset((input.page - 1) * input.limit);

    return {
      items: records.map((record) =>
        ReferenceCountry.restore({
          id: EntityIdValueObject.fromString(record.id),
          isoCode: record.isoCode!,
          nameRu: record.nameRu,
          nameUz: record.nameUz,
          nameEn: record.nameEn,
          createdAt: DateTimeValueObject.fromDate(record.createdAt),
          updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
        }),
      ),
      total: totalRecord.value,
    };
  }

  async suggest(input: ReferenceSuggestInput): Promise<ReferenceSuggestion[]> {
    const pattern = `%${input.query.trim()}%`;
    const [featured, countryItems, cityItems, airportItems] = await Promise.all(
      [
        this.suggestFeaturedFlightLocations(pattern, input),
        input.types.includes('country')
          ? this.suggestCountries(pattern, input.limit)
          : Promise.resolve([]),
        input.types.includes('city')
          ? this.suggestCities(pattern, input)
          : Promise.resolve([]),
        input.types.includes('airport')
          ? this.suggestAirports(pattern, input)
          : Promise.resolve([]),
      ],
    );

    const featuredCodes = new Set(
      featured.map((item) => item.code).filter((code) => code !== null),
    );
    const featuredCityIds = new Set(
      featured.map((item) => item.cityId).filter((cityId) => cityId !== null),
    );
    const regular = [...countryItems, ...cityItems, ...airportItems].filter(
      (item) =>
        (item.code === null || !featuredCodes.has(item.code)) &&
        (item.cityId === null || !featuredCityIds.has(item.cityId)),
    );

    return [...featured, ...regular].slice(0, input.limit);
  }

  private async suggestFeaturedFlightLocations(
    pattern: string,
    input: ReferenceSuggestInput,
  ): Promise<ReferenceSuggestion[]> {
    if (!input.types.includes('city') && !input.types.includes('airport')) {
      return [];
    }

    const rows = await this.database
      .select({
        featured: featuredFlightLocations,
        city: cities,
        airport: airports,
        country: countries,
      })
      .from(featuredFlightLocations)
      .innerJoin(
        countries,
        sql`lower(${countries.nameRu}) = lower(${featuredFlightLocations.countryName})`,
      )
      .leftJoin(
        cities,
        and(
          eq(cities.countryId, countries.id),
          sql`lower(${cities.nameRu}) = lower(${featuredFlightLocations.name})`,
        ),
      )
      .leftJoin(airports, eq(airports.iataCode, featuredFlightLocations.code))
      .where(
        and(
          eq(featuredFlightLocations.isActive, true),
          input.countryId ? eq(countries.id, input.countryId) : undefined,
          or(
            ilike(featuredFlightLocations.code, pattern),
            ilike(featuredFlightLocations.name, pattern),
            ilike(featuredFlightLocations.countryName, pattern),
          ),
        ),
      )
      .orderBy(asc(featuredFlightLocations.sortOrder))
      .limit(input.limit);

    return rows.flatMap(
      ({ featured, city, airport, country }): ReferenceSuggestion[] => {
        if (city && input.types.includes('city')) {
          return [
            {
              type: 'city',
              id: city.id,
              code: featured.code,
              name: featured.name,
              countryId: country.id,
              countryCode: country.isoCode,
              countryName: country.nameRu,
              cityId: city.id,
            },
          ];
        }
        if (airport && input.types.includes('airport')) {
          return [
            {
              type: 'airport',
              id: airport.id,
              code: featured.code,
              name: featured.name,
              countryId: country.id,
              countryCode: country.isoCode,
              countryName: country.nameRu,
              cityId: airport.cityId,
            },
          ];
        }
        return [];
      },
    );
  }

  async listFeaturedFlightLocations(
    includeInactive = false,
  ): Promise<FeaturedFlightLocation[]> {
    return this.database
      .select({
        code: featuredFlightLocations.code,
        name: featuredFlightLocations.name,
        countryName: featuredFlightLocations.countryName,
        sortOrder: featuredFlightLocations.sortOrder,
        isActive: featuredFlightLocations.isActive,
      })
      .from(featuredFlightLocations)
      .where(
        includeInactive
          ? undefined
          : eq(featuredFlightLocations.isActive, true),
      )
      .orderBy(asc(featuredFlightLocations.sortOrder));
  }

  async replaceFeaturedFlightLocations(
    items: FeaturedFlightLocation[],
  ): Promise<FeaturedFlightLocation[]> {
    await this.database.transaction(async (transaction) => {
      await transaction.delete(featuredFlightLocations);
      if (items.length)
        await transaction.insert(featuredFlightLocations).values(items);
    });
    return this.listFeaturedFlightLocations(true);
  }

  async destinationExists(
    countryId: string,
    cityId: string | null,
  ): Promise<boolean> {
    const rows = await this.database
      .select({ id: countries.id })
      .from(countries)
      .leftJoin(cities, eq(cities.countryId, countries.id))
      .where(
        and(
          eq(countries.id, countryId),
          cityId ? eq(cities.id, cityId) : undefined,
        ),
      )
      .limit(1);
    return rows.length === 1;
  }

  private async suggestCountries(pattern: string, limit: number) {
    const rows = await this.database
      .select()
      .from(countries)
      .where(
        and(
          isNotNull(countries.isoCode),
          or(
            ilike(countries.nameRu, pattern),
            ilike(countries.nameUz, pattern),
            ilike(countries.nameEn, pattern),
            ilike(countries.isoCode, pattern),
          ),
        ),
      )
      .orderBy(asc(countries.nameRu))
      .limit(limit);
    return rows.map(
      (row): ReferenceSuggestion => ({
        type: 'country',
        id: row.id,
        code: row.isoCode,
        name: row.nameRu,
        countryId: row.id,
        countryCode: row.isoCode,
        countryName: row.nameRu,
        cityId: null,
      }),
    );
  }

  private async suggestCities(pattern: string, input: ReferenceSuggestInput) {
    const countryFilter = input.countryId
      ? eq(cities.countryId, input.countryId)
      : undefined;
    const rows = await this.database
      .select({ city: cities, country: countries })
      .from(cities)
      .innerJoin(countries, eq(cities.countryId, countries.id))
      .where(
        and(
          countryFilter,
          or(
            ilike(cities.nameRu, pattern),
            ilike(cities.nameUz, pattern),
            ilike(cities.nameEn, pattern),
            ilike(countries.nameRu, pattern),
            ilike(countries.nameUz, pattern),
            ilike(countries.nameEn, pattern),
          ),
        ),
      )
      .orderBy(asc(cities.nameRu))
      .limit(input.limit);
    return rows.map(
      ({ city, country }): ReferenceSuggestion => ({
        type: 'city',
        id: city.id,
        code: null,
        name: city.nameRu,
        countryId: country.id,
        countryCode: country.isoCode,
        countryName: country.nameRu,
        cityId: city.id,
      }),
    );
  }

  private async suggestAirports(pattern: string, input: ReferenceSuggestInput) {
    const countryFilter = input.countryId
      ? eq(airports.countryId, input.countryId)
      : undefined;
    const rows = await this.database
      .select({
        airport: airports,
        city: cities,
        country: countries,
        name: sql<string>`coalesce(${airports.nameRu}, ${airports.nameEn}, ${airports.iataCode})`,
      })
      .from(airports)
      .innerJoin(countries, eq(airports.countryId, countries.id))
      .leftJoin(cities, eq(airports.cityId, cities.id))
      .where(
        and(
          countryFilter,
          or(
            ilike(airports.iataCode, pattern),
            ilike(airports.nameRu, pattern),
            ilike(airports.nameEn, pattern),
            ilike(cities.nameRu, pattern),
            ilike(cities.nameUz, pattern),
            ilike(cities.nameEn, pattern),
            ilike(countries.nameRu, pattern),
            ilike(countries.nameUz, pattern),
            ilike(countries.nameEn, pattern),
          ),
        ),
      )
      .orderBy(asc(airports.iataCode))
      .limit(input.limit);
    return rows.map(
      ({ airport, city, country, name }): ReferenceSuggestion => ({
        type: 'airport',
        id: airport.id,
        code: airport.iataCode,
        name: city ? `${name}, ${city.nameRu}` : name,
        countryId: country.id,
        countryCode: country.isoCode,
        countryName: country.nameRu,
        cityId: airport.cityId,
      }),
    );
  }
}
