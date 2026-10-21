import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  airports,
  cities,
  countries,
} from '../src/core/submodules/reference/infrastructure/persistence/reference.schema';

config({ path: resolve(__dirname, '../.env') });

interface CountryCsvRow {
  country_id: string;
  name: string;
}
interface CityCsvRow {
  city_id: string;
  country_id: string;
  region_id: string;
  name: string;
}
interface AirportSource {
  iataCode: string;
  nameRu: string | null;
  nameEn: string | null;
  cityRu: string | null;
  cityEn: string | null;
  countryRu: string;
  countryEn: string | null;
  isoCode: string;
  latitude: string;
  longitude: string;
}

type CountryInsert = typeof countries.$inferInsert;
type CityInsert = typeof cities.$inferInsert;
type AirportInsert = typeof airports.$inferInsert;

const BATCH_SIZE = 500;
const dataDirectory = resolve(__dirname, '../seeds/reference');

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function stableUuid(key: string): string {
  const hash = createHash('sha256').update(`protravel:${key}`).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(
    13,
    16,
  )}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function normalize(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/g, ' ')
    .trim();
}

function nullable(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function positiveInteger(value: string, field: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0)
    throw new Error(`${field} is invalid: ${value}`);
  return parsed;
}

function batches<T>(items: T[]): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += BATCH_SIZE) {
    result.push(items.slice(index, index + BATCH_SIZE));
  }
  return result;
}

async function readSources() {
  const [countryContent, cityContent, airportContent] = await Promise.all([
    readFile(resolve(dataDirectory, 'country.csv'), 'utf8'),
    readFile(resolve(dataDirectory, 'city.csv'), 'utf8'),
    readFile(resolve(dataDirectory, 'airoports.csv'), 'utf8'),
  ]);
  const countryRows = parse<CountryCsvRow>(countryContent, {
    bom: true,
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true,
  });
  const cityRows = parse<CityCsvRow>(cityContent, {
    bom: true,
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true,
  });
  const rawAirports = parse(airportContent, {
    bom: true,
    delimiter: '|',
    relax_column_count: true,
    skip_empty_lines: true,
  });
  const invalidAirports: string[] = [];
  const airportByCode = new Map<string, AirportSource>();
  for (const row of rawAirports) {
    const iataCode = row[1]?.trim().toUpperCase();
    if (iataCode === 'IATA_CODE') continue;
    const isoCode = row[15]?.trim().toUpperCase();
    const latitude = Number(row[17]);
    const longitude = Number(row[19]);
    if (
      !/^[A-Z0-9]{3}$/.test(iataCode) ||
      !/^[A-Z]{2}$/.test(isoCode) ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      invalidAirports.push(iataCode || `line-${invalidAirports.length + 2}`);
      continue;
    }
    airportByCode.set(iataCode, {
      iataCode,
      nameRu: nullable(row[3]),
      nameEn: nullable(row[5]),
      cityRu: nullable(row[7]),
      cityEn: nullable(row[9]),
      countryRu: nullable(row[11]) ?? nullable(row[13]) ?? isoCode,
      countryEn: nullable(row[13]),
      isoCode,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
  }
  return {
    countryRows,
    cityRows,
    airportRows: [...airportByCode.values()],
    invalidAirports,
  };
}

async function seedReferenceData(): Promise<void> {
  const source = await readSources();
  const airportCountryByIso = new Map<
    string,
    Pick<AirportSource, 'isoCode' | 'countryRu' | 'countryEn'>
  >();
  for (const airport of source.airportRows)
    airportCountryByIso.set(airport.isoCode, airport);
  const airportCountryByRu = new Map(
    [...airportCountryByIso.values()].map((country) => [
      normalize(country.countryRu),
      country,
    ]),
  );

  const countryRows: CountryInsert[] = [];
  const countryIdByLegacy = new Map<number, string>();
  const countryIdByIso = new Map<string, string>();
  const matchedIso = new Set<string>();
  for (const sourceCountry of source.countryRows) {
    const legacyId = positiveInteger(sourceCountry.country_id, 'country_id');
    const airportCountryCandidate = airportCountryByRu.get(
      normalize(sourceCountry.name),
    );
    const airportCountry =
      airportCountryCandidate &&
      !matchedIso.has(airportCountryCandidate.isoCode)
        ? airportCountryCandidate
        : undefined;
    const id = stableUuid(`country:legacy:${legacyId}`);
    countryRows.push({
      id,
      legacyId,
      isoCode: airportCountry?.isoCode ?? null,
      nameRu: sourceCountry.name.trim(),
      nameEn: airportCountry?.countryEn ?? null,
      nameUz: null,
    });
    countryIdByLegacy.set(legacyId, id);
    if (airportCountry) {
      countryIdByIso.set(airportCountry.isoCode, id);
      matchedIso.add(airportCountry.isoCode);
    }
  }
  for (const airportCountry of airportCountryByIso.values()) {
    if (matchedIso.has(airportCountry.isoCode)) continue;
    const id = stableUuid(`country:iso:${airportCountry.isoCode}`);
    countryRows.push({
      id,
      legacyId: null,
      isoCode: airportCountry.isoCode,
      nameRu: airportCountry.countryRu,
      nameEn: airportCountry.countryEn,
      nameUz: null,
    });
    countryIdByIso.set(airportCountry.isoCode, id);
  }

  const cityRows: CityInsert[] = [];
  const cityIdByCountryAndName = new Map<string, string>();
  for (const sourceCity of source.cityRows) {
    const legacyId = positiveInteger(sourceCity.city_id, 'city_id');
    const countryId = countryIdByLegacy.get(
      positiveInteger(sourceCity.country_id, 'country_id'),
    );
    if (!countryId)
      throw new Error(`City ${legacyId} references an unknown country`);
    const id = stableUuid(`city:legacy:${legacyId}`);
    const nameRu = sourceCity.name.trim();
    cityRows.push({
      id,
      legacyId,
      legacyRegionId: positiveInteger(sourceCity.region_id, 'region_id'),
      countryId,
      nameRu,
      nameUz: null,
      nameEn: null,
    });
    cityIdByCountryAndName.set(`${countryId}:${normalize(nameRu)}`, id);
  }
  for (const airport of source.airportRows) {
    const countryId = countryIdByIso.get(airport.isoCode);
    const displayName = airport.cityRu ?? airport.cityEn;
    if (!countryId || !displayName) continue;
    const key = `${countryId}:${normalize(displayName)}`;
    if (cityIdByCountryAndName.has(key)) continue;
    const id = stableUuid(
      `city:airport:${airport.isoCode}:${normalize(
        airport.cityEn ?? displayName,
      )}`,
    );
    cityRows.push({
      id,
      legacyId: null,
      legacyRegionId: null,
      countryId,
      nameRu: airport.cityRu ?? displayName,
      nameUz: null,
      nameEn: airport.cityEn,
    });
    cityIdByCountryAndName.set(key, id);
    if (airport.cityEn)
      cityIdByCountryAndName.set(
        `${countryId}:${normalize(airport.cityEn)}`,
        id,
      );
  }

  const airportRows: AirportInsert[] = source.airportRows.map((airport) => {
    const countryId = countryIdByIso.get(airport.isoCode);
    if (!countryId)
      throw new Error(
        `Airport ${airport.iataCode} references an unknown country`,
      );
    const cityName = airport.cityRu ?? airport.cityEn;
    return {
      id: stableUuid(`airport:${airport.iataCode}`),
      iataCode: airport.iataCode,
      countryId,
      cityId: cityName
        ? cityIdByCountryAndName.get(`${countryId}:${normalize(cityName)}`) ??
          null
        : null,
      nameRu: airport.nameRu,
      nameEn: airport.nameEn,
      latitude: airport.latitude,
      longitude: airport.longitude,
    };
  });

  const pool = new Pool({
    host: requiredEnv('DATABASE_HOST'),
    port: Number(requiredEnv('DATABASE_PORT')),
    database: requiredEnv('DATABASE_NAME'),
    user: requiredEnv('DATABASE_USER'),
    password: requiredEnv('DATABASE_PASSWORD'),
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
    max: 1,
  });
  const database = drizzle(pool);
  try {
    await database.transaction(async (transaction) => {
      for (const batch of batches(countryRows)) {
        await transaction
          .insert(countries)
          .values(batch)
          .onConflictDoUpdate({
            target: countries.id,
            set: {
              legacyId: sql`excluded.legacy_id`,
              isoCode: sql`excluded.iso_code`,
              nameRu: sql`excluded.name_ru`,
              nameUz: sql`excluded.name_uz`,
              nameEn: sql`excluded.name_en`,
              updatedAt: new Date(),
            },
          });
      }
      for (const batch of batches(cityRows)) {
        await transaction
          .insert(cities)
          .values(batch)
          .onConflictDoUpdate({
            target: cities.id,
            set: {
              legacyId: sql`excluded.legacy_id`,
              legacyRegionId: sql`excluded.legacy_region_id`,
              countryId: sql`excluded.country_id`,
              nameRu: sql`excluded.name_ru`,
              nameUz: sql`excluded.name_uz`,
              nameEn: sql`excluded.name_en`,
              updatedAt: new Date(),
            },
          });
      }
      for (const batch of batches(airportRows)) {
        await transaction
          .insert(airports)
          .values(batch)
          .onConflictDoUpdate({
            target: airports.id,
            set: {
              iataCode: sql`excluded.iata_code`,
              countryId: sql`excluded.country_id`,
              cityId: sql`excluded.city_id`,
              nameRu: sql`excluded.name_ru`,
              nameEn: sql`excluded.name_en`,
              latitude: sql`excluded.latitude`,
              longitude: sql`excluded.longitude`,
              updatedAt: new Date(),
            },
          });
      }
    });
    console.info(
      `Reference seed complete: ${countryRows.length} countries, ${cityRows.length} cities, ` +
        `${airportRows.length} airports; skipped ${source.invalidAirports.length} invalid airports.`,
    );
  } finally {
    await pool.end();
  }
}

seedReferenceData().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
