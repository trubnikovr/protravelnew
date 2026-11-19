import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  inArray,
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
  airportCodes: string[];
}

export interface ReferenceSuggestInput {
  query: string;
  types: ReferenceSuggestionType[];
  countryId?: string;
  limit: number;
}

export interface FeaturedFlightLocation {
  cityId: string;
  name: string;
  countryName: string;
  airportCodes: string[];
  sortOrder: number;
  isActive: boolean;
}

export interface ReplaceFeaturedFlightLocation {
  cityId: string;
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
        (item.type !== 'city' ||
          item.cityId === null ||
          !featuredCityIds.has(item.cityId)),
    );
    return this.attachAirportCodes(
      [...featured, ...regular].slice(0, input.limit),
    );
  }

  private async attachAirportCodes(
    suggestions: ReferenceSuggestion[],
  ): Promise<ReferenceSuggestion[]> {
    const cityIds = [
      ...new Set(
        suggestions
          .filter((item) => item.type === 'city')
          .map((item) => item.cityId)
          .filter((id): id is string => id !== null),
      ),
    ];
    const rows = cityIds.length
      ? await this.database
          .select({ cityId: airports.cityId, code: airports.iataCode })
          .from(airports)
          .where(inArray(airports.cityId, cityIds))
      : [];
    const codesByCity = new Map<string, string[]>();
    for (const row of rows) {
      if (!row.cityId) continue;
      codesByCity.set(row.cityId, [
        ...(codesByCity.get(row.cityId) ?? []),
        row.code,
      ]);
    }
    return suggestions.map((item) => ({
      ...item,
      airportCodes:
        item.type === 'airport' && item.code
          ? [item.code]
          : item.cityId
            ? (codesByCity.get(item.cityId) ?? [])
            : [],
    }));
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
        country: countries,
      })
      .from(featuredFlightLocations)
      .innerJoin(cities, eq(cities.id, featuredFlightLocations.cityId))
      .innerJoin(countries, eq(countries.id, cities.countryId))
      .where(
        and(
          eq(featuredFlightLocations.isActive, true),
          input.countryId ? eq(countries.id, input.countryId) : undefined,
          or(
            ilike(cities.nameRu, pattern),
            ilike(countries.nameRu, pattern),
          ),
        ),
      )
      .orderBy(asc(featuredFlightLocations.sortOrder))
      .limit(input.limit);

    return rows.flatMap(
      ({ city, country }): ReferenceSuggestion[] => {
        if (input.types.includes('city')) {
          return [
            {
              type: 'city',
              id: city.id,
              code: null,
              name: city.nameRu,
              countryId: country.id,
              countryCode: country.isoCode,
              countryName: country.nameRu,
              cityId: city.id,
              airportCodes: [],
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
    const rows = await this.database
      .select({
        cityId: cities.id,
        name: cities.nameRu,
        countryName: countries.nameRu,
        sortOrder: featuredFlightLocations.sortOrder,
        isActive: featuredFlightLocations.isActive,
      })
      .from(featuredFlightLocations)
      .innerJoin(cities, eq(cities.id, featuredFlightLocations.cityId))
      .innerJoin(countries, eq(countries.id, cities.countryId))
      .where(
        includeInactive
          ? undefined
          : eq(featuredFlightLocations.isActive, true),
      )
      .orderBy(asc(featuredFlightLocations.sortOrder));
    if (!rows.length) return [];
    const airportRows = await this.database
      .select({ cityId: airports.cityId, code: airports.iataCode })
      .from(airports)
      .where(inArray(airports.cityId, rows.map((row) => row.cityId)));
    const codesByCity = new Map<string, string[]>();
    for (const airport of airportRows) {
      if (!airport.cityId) continue;
      codesByCity.set(airport.cityId, [
        ...(codesByCity.get(airport.cityId) ?? []),
        airport.code,
      ]);
    }
    return rows.map((row) => ({
      ...row,
      airportCodes: codesByCity.get(row.cityId) ?? [],
    }));
  }

  async replaceFeaturedFlightLocations(
    items: ReplaceFeaturedFlightLocation[],
  ): Promise<FeaturedFlightLocation[]> {
    const uniqueItems = [...new Map(items.map((item) => [item.cityId, item])).values()];
    await this.database.transaction(async (transaction) => {
      await transaction.delete(featuredFlightLocations);
      if (uniqueItems.length)
        await transaction.insert(featuredFlightLocations).values(uniqueItems);
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
    return rows.map((row): ReferenceSuggestion => ({
      type: 'country',
      id: row.id,
      code: row.isoCode,
      name: row.nameRu,
      countryId: row.id,
      countryCode: row.isoCode,
      countryName: row.nameRu,
      cityId: null,
        airportCodes: [],
    }));
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
    return rows.map(({ city, country }): ReferenceSuggestion => ({
      type: 'city',
      id: city.id,
      code: null,
      name: city.nameRu,
      countryId: country.id,
      countryCode: country.isoCode,
      countryName: country.nameRu,
      cityId: city.id,
        airportCodes: [],
    }));
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
        airportCodes: [airport.iataCode],
      }),
    );
  }
}
