import { createHash } from 'node:crypto';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  airports,
  cities,
  countries,
} from '../src/core/submodules/reference/infrastructure/persistence/reference.schema';
import {
  tourContent,
  tourDestinations,
  tourPackageDetails,
  tours,
} from '../src/modules/tours/infrastructure/persistence/tour.schema';
import { customers } from '../src/modules/customers/infrastructure/persistence/customer.schema';
import { CustomerStatus } from '../src/modules/customers/domain/customer.types';
import { CurrencyCode, SupportedLocale } from '../src/shared/domain/enums';
import { systemMessages } from '../src/modules/content/infrastructure/persistence/system-message.schema';
import type { SystemMessageType } from '../src/modules/content/domain/system-message';

config({ path: resolve(__dirname, '../.env') });

interface DemoTour {
  slug: string;
  airportCode: string;
  title: string;
  description: string;
  hotelName: string;
  days: number;
  nights: number;
  amount: string;
  coverAsset?: string;
}

const demoTours: DemoTour[] = [
  {
    slug: 'demo-antaliya-all-inclusive',
    airportCode: 'AYT',
    title: 'Анталья — всё включено',
    description: 'Пляжный отдых в Анталье с проживанием и трансфером.',
    hotelName: 'Mediterranean Resort Antalya',
    days: 8,
    nights: 7,
    amount: '12500000',
    coverAsset: 'antalya.jpg',
  },
  {
    slug: 'demo-dubai-city-break',
    airportCode: 'DXB',
    title: 'Яркий Дубай',
    description: 'Современный Дубай, пляжи и главные достопримечательности.',
    hotelName: 'Dubai Marina Hotel',
    days: 6,
    nights: 5,
    amount: '16800000',
    coverAsset: 'dubai.jpg',
  },
  {
    slug: 'demo-sharm-red-sea',
    airportCode: 'SSH',
    title: 'Красное море — Шарм-эль-Шейх',
    description: 'Море, коралловые рифы и семейный отель.',
    hotelName: 'Sinai Beach Resort',
    days: 8,
    nights: 7,
    amount: '11900000',
  },
  {
    slug: 'demo-phuket-tropical',
    airportCode: 'HKT',
    title: 'Тропический Пхукет',
    description: 'Отдых на Пхукете рядом с морем и островными маршрутами.',
    hotelName: 'Phuket Palm Resort',
    days: 10,
    nights: 9,
    amount: '21500000',
  },
  {
    slug: 'demo-maldives-ocean',
    airportCode: 'MLE',
    title: 'Мальдивы — океанская вилла',
    description: 'Спокойный островной отдых и проживание у океана.',
    hotelName: 'Maldives Ocean Villas',
    days: 7,
    nights: 6,
    amount: '28900000',
  },
  {
    slug: 'demo-bali-discovery',
    airportCode: 'DPS',
    title: 'Открытие Бали',
    description: 'Пляжи, храмы и природные маршруты острова Бали.',
    hotelName: 'Bali Garden Retreat',
    days: 11,
    nights: 10,
    amount: '23400000',
  },
  {
    slug: 'demo-tbilisi-weekend',
    airportCode: 'TBS',
    title: 'Выходные в Тбилиси',
    description: 'Старый город, грузинская кухня и прогулки по Тбилиси.',
    hotelName: 'Old Tbilisi Boutique',
    days: 4,
    nights: 3,
    amount: '7200000',
    coverAsset: 'tbilisi.jpg',
  },
  {
    slug: 'demo-baku-caspian',
    airportCode: 'GYD',
    title: 'Баку и Каспийское море',
    description: 'Архитектура Баку, набережная и экскурсионная программа.',
    hotelName: 'Caspian Boulevard Hotel',
    days: 5,
    nights: 4,
    amount: '8100000',
    coverAsset: 'baku.jpg',
  },
  {
    slug: 'demo-rome-classic',
    airportCode: 'FCO',
    title: 'Классический Рим',
    description: 'Исторический центр Рима и знакомство с итальянской кухней.',
    hotelName: 'Roma Centro Hotel',
    days: 6,
    nights: 5,
    amount: '17600000',
  },
  {
    slug: 'demo-barcelona-mediterranean',
    airportCode: 'BCN',
    title: 'Средиземноморская Барселона',
    description: 'Архитектура, море и насыщенная городская программа.',
    hotelName: 'Barcelona Coast Hotel',
    days: 7,
    nights: 6,
    amount: '18400000',
  },
];

const demoCustomers = [
  ['Азиз', 'Каримов'],
  ['Малика', 'Рахимова'],
  ['Тимур', 'Садыков'],
  ['Диана', 'Юсупова'],
  ['Рустам', 'Ахмедов'],
  ['Сабина', 'Абдуллаева'],
  ['Даврон', 'Ибрагимов'],
  ['Нилуфар', 'Хасанова'],
  ['Александр', 'Петров'],
  ['Мария', 'Смирнова'],
] as const;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function stableUuid(key: string): string {
  const hash = createHash('sha256')
    .update(`protravel:demo:${key}`)
    .digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(
    13,
    16,
  )}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

async function seedDemoData(): Promise<void> {
  const coverUrls = await prepareTourCovers();
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
      await transaction
        .insert(systemMessages)
        .values({
          id: stableUuid('system-message:demo-info'),
          text: 'Мы улучшаем сервис. Некоторые функции могут быть временно недоступны.',
          type: 'info' as SystemMessageType,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: systemMessages.id,
          set: {
            text: 'Мы улучшаем сервис. Некоторые функции могут быть временно недоступны.',
            type: 'info' as SystemMessageType,
            isActive: true,
            updatedAt: new Date(),
          },
        });

      for (const [index, item] of demoCustomers.entries()) {
        const sequence = String(index + 1).padStart(2, '0');
        await transaction
          .insert(customers)
          .values({
            id: stableUuid(`customer:${sequence}`),
            phone: `+9989000010${sequence}`,
            email: `demo${sequence}@protravel.local`,
            firstName: item[0],
            lastName: item[1],
            locale: SupportedLocale.RU,
            currency: CurrencyCode.RUB,
            timeZone: 'Asia/Tashkent',
            status: CustomerStatus.ACTIVE,
          })
          .onConflictDoUpdate({
            target: customers.email,
            set: {
              phone: sql`excluded.phone`,
              firstName: sql`excluded.first_name`,
              lastName: sql`excluded.last_name`,
              updatedAt: new Date(),
            },
          });
      }

      for (const [index, item] of demoTours.entries()) {
        const [destination] = await transaction
          .select({
            countryId: countries.id,
            cityId: cities.id,
            airportId: airports.id,
          })
          .from(airports)
          .innerJoin(countries, eq(airports.countryId, countries.id))
          .innerJoin(cities, eq(airports.cityId, cities.id))
          .where(eq(airports.iataCode, item.airportCode))
          .limit(1);
        if (!destination) {
          throw new Error(
            `Reference airport ${item.airportCode} is missing; run backend:seed:reference first`,
          );
        }
        const [tour] = await transaction
          .insert(tours)
          .values({
            id: stableUuid(`tour:${item.slug}`),
            slug: item.slug,
            status: 'published',
            type: 'package',
            durationDays: item.days,
            durationNights: item.nights,
            basePriceAmount: item.amount,
            currency: CurrencyCode.RUB,
            coverImageUrl: coverUrls.get(item.slug) ?? null,
            isFeatured: index < 4,
            sortOrder: index + 1,
            publishedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: tours.slug,
            set: {
              status: 'published',
              type: 'package',
              durationDays: item.days,
              durationNights: item.nights,
              basePriceAmount: item.amount,
              currency: CurrencyCode.RUB,
              coverImageUrl: coverUrls.get(item.slug) ?? null,
              isFeatured: index < 4,
              sortOrder: index + 1,
              publishedAt: new Date(),
              updatedAt: new Date(),
            },
          })
          .returning({ id: tours.id });
        await transaction
          .insert(tourContent)
          .values({
            tourId: tour.id,
            title: item.title,
            shortDescription: item.description,
            description: item.description,
            inclusions: ['Проживание', 'Трансфер', 'Медицинская страховка'],
            exclusions: ['Личные расходы', 'Дополнительные экскурсии'],
          })
          .onConflictDoUpdate({
            target: tourContent.tourId,
            set: {
              title: item.title,
              shortDescription: item.description,
              description: item.description,
              inclusions: ['Проживание', 'Трансфер', 'Медицинская страховка'],
              exclusions: ['Личные расходы', 'Дополнительные экскурсии'],
              updatedAt: new Date(),
            },
          });
        await transaction
          .delete(tourDestinations)
          .where(eq(tourDestinations.tourId, tour.id));
        await transaction.insert(tourDestinations).values({
          tourId: tour.id,
          position: 1,
          countryId: destination.countryId,
          cityId: destination.cityId,
          arrivalAirportId: destination.airportId,
          nights: item.nights,
        });
        await transaction
          .insert(tourPackageDetails)
          .values({
            tourId: tour.id,
            hotelName: item.hotelName,
            hotelCategory: 4,
            mealType: 'breakfast',
            transferIncluded: true,
            insuranceIncluded: true,
          })
          .onConflictDoUpdate({
            target: tourPackageDetails.tourId,
            set: {
              hotelName: item.hotelName,
              hotelCategory: 4,
              mealType: 'breakfast',
              transferIncluded: true,
              insuranceIncluded: true,
              updatedAt: new Date(),
            },
          });
      }
    });
    console.info(
      `Demo seed complete: ${demoTours.length} tours, ${demoCustomers.length} customers and one system message.`,
    );
  } finally {
    await pool.end();
  }
}

async function prepareTourCovers(): Promise<Map<string, string>> {
  const backendRoot = resolve(__dirname, '..');
  const uploadDirectory = resolve(
    backendRoot,
    requiredEnv('UPLOAD_DIRECTORY'),
    'images',
  );
  const sourceDirectory = resolve(__dirname, '../seeds/tour-covers');
  const publicUrl = requiredEnv('PUBLIC_API_URL').replace(/\/$/, '');
  const apiPrefix = requiredEnv('API_PREFIX').replace(/^\/+|\/+$/g, '');
  const urls = new Map<string, string>();
  await mkdir(uploadDirectory, { recursive: true });
  for (const tour of demoTours) {
    if (!tour.coverAsset) continue;
    const filename = `${stableUuid(`cover:${tour.slug}`)}.jpg`;
    await copyFile(
      resolve(sourceDirectory, tour.coverAsset),
      resolve(uploadDirectory, filename),
    );
    urls.set(
      tour.slug,
      `${publicUrl}/${apiPrefix}/v1/files/images/${filename}`,
    );
  }
  return urls;
}

seedDemoData().catch((error: unknown) => {
  console.error(
    error instanceof Error && 'cause' in error ? error.cause : error,
  );
  process.exitCode = 1;
});
