import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  ilike,
  or,
  type SQL,
} from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import type { Tour } from '../../domain/tour';
import {
  cities,
  countries,
} from '@core/submodules/reference/infrastructure/persistence/reference.schema';
import { TourStatus, TourType } from '../../domain/tour.types';
import type {
  TourListFilter,
  TourListResult,
  ToursRepository,
  TourUpdateData,
  TourWriteData,
} from '../../application/tours.repository';
import {
  TourPersistenceMapper,
  type TourRecordBundle,
} from './tour-persistence.mapper';
import {
  tourContent,
  tourDepartures,
  tourDestinations,
  tourExcursionDetails,
  tourImages,
  tourPackageDetails,
  tourProgramDays,
  tours,
  type TourRecord,
} from './tour.schema';

type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

@Injectable()
export class DrizzleToursRepository implements ToursRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async create(data: TourWriteData): Promise<Tour> {
    const id = await this.database.transaction(async (transaction) => {
      const [record] = await transaction
        .insert(tours)
        .values({
          ...this.toColumns(data),
          publishedAt: this.publishedAt(data.status),
        })
        .returning({ id: tours.id });
      await this.writeRelations(transaction, record.id, data);
      return record.id;
    });
    return (await this.findById(id))!;
  }

  async findById(id: string): Promise<Tour | null> {
    const [record] = await this.database
      .select()
      .from(tours)
      .where(eq(tours.id, id))
      .limit(1);
    return record ? this.load(record) : null;
  }

  async list(filter: TourListFilter): Promise<TourListResult> {
    const where = this.listWhere(filter);
    const join = eq(tourContent.tourId, tours.id);
    const [totalRecord] = await this.database
      .select({ value: count() })
      .from(tours)
      .leftJoin(tourContent, join)
      .where(where);
    const records = await this.database
      .select({ tour: tours })
      .from(tours)
      .leftJoin(tourContent, join)
      .where(where)
      .orderBy(
        filter.sortDirection === 'asc'
          ? asc(this.sortColumn(filter.sortBy))
          : desc(this.sortColumn(filter.sortBy)),
        desc(tours.id),
      )
      .limit(filter.limit)
      .offset((filter.page - 1) * filter.limit);
    return {
      items: await Promise.all(records.map(({ tour }) => this.load(tour))),
      total: totalRecord.value,
    };
  }

  async update(id: string, data: TourUpdateData): Promise<Tour | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    const relations = this.mergeTypeRelations(existing, data);
    await this.database.transaction(async (transaction) => {
      await transaction
        .update(tours)
        .set({ ...this.toUpdateColumns(data), updatedAt: new Date() })
        .where(eq(tours.id, id));
      await this.updateRelations(transaction, id, relations);
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.database
      .delete(tours)
      .where(eq(tours.id, id))
      .returning({ id: tours.id });
    return deleted.length > 0;
  }

  private async load(record: TourRecord): Promise<Tour> {
    const [
      contentRows,
      images,
      destinations,
      departures,
      packageRows,
      excursionRows,
      programDays,
    ] = await Promise.all([
      this.database
        .select()
        .from(tourContent)
        .where(eq(tourContent.tourId, record.id)),
      this.database
        .select()
        .from(tourImages)
        .where(eq(tourImages.tourId, record.id))
        .orderBy(asc(tourImages.sortOrder)),
      this.loadDestinations(record.id),
      this.database
        .select()
        .from(tourDepartures)
        .where(eq(tourDepartures.tourId, record.id))
        .orderBy(asc(tourDepartures.departureDate)),
      this.database
        .select()
        .from(tourPackageDetails)
        .where(eq(tourPackageDetails.tourId, record.id)),
      this.database
        .select()
        .from(tourExcursionDetails)
        .where(eq(tourExcursionDetails.tourId, record.id)),
      this.database
        .select()
        .from(tourProgramDays)
        .where(eq(tourProgramDays.tourId, record.id))
        .orderBy(asc(tourProgramDays.dayNumber)),
    ]);
    if (!contentRows[0])
      throw new Error(`Stored tour ${record.id} has no content`);
    const bundle: TourRecordBundle = {
      tour: record,
      content: contentRows[0],
      images,
      destinations,
      departures,
      packageDetails: packageRows[0] ?? null,
      excursionDetails: excursionRows[0] ?? null,
      programDays,
    };
    return TourPersistenceMapper.toDomain(bundle);
  }

  private loadDestinations(tourId: string) {
    return this.database
      .select({
        id: tourDestinations.id,
        tourId: tourDestinations.tourId,
        position: tourDestinations.position,
        countryId: tourDestinations.countryId,
        countryCode: countries.isoCode,
        countryName: countries.nameRu,
        cityId: tourDestinations.cityId,
        cityName: cities.nameRu,
        arrivalAirportId: tourDestinations.arrivalAirportId,
        nights: tourDestinations.nights,
        createdAt: tourDestinations.createdAt,
        updatedAt: tourDestinations.updatedAt,
      })
      .from(tourDestinations)
      .innerJoin(countries, eq(tourDestinations.countryId, countries.id))
      .leftJoin(cities, eq(tourDestinations.cityId, cities.id))
      .where(eq(tourDestinations.tourId, tourId))
      .orderBy(asc(tourDestinations.position));
  }

  private listWhere(filter: TourListFilter): SQL | undefined {
    const conditions: SQL[] = [];
    if (filter.status) conditions.push(eq(tours.status, filter.status));
    if (filter.type) conditions.push(eq(tours.type, filter.type));
    if (filter.isFeatured !== undefined) {
      conditions.push(eq(tours.isFeatured, filter.isFeatured));
    }
    if (filter.search) {
      const match = or(
        ilike(tours.slug, `%${filter.search}%`),
        ilike(tourContent.title, `%${filter.search}%`),
      );
      if (match) conditions.push(match);
    }
    if (filter.destination) {
      conditions.push(
        exists(
          this.database
            .select({ id: tourDestinations.id })
            .from(tourDestinations)
            .innerJoin(countries, eq(tourDestinations.countryId, countries.id))
            .leftJoin(cities, eq(tourDestinations.cityId, cities.id))
            .where(
              and(
                eq(tourDestinations.tourId, tours.id),
                or(
                  ilike(countries.nameRu, `%${filter.destination}%`),
                  ilike(cities.nameRu, `%${filter.destination}%`),
                ),
              ),
            ),
        ),
      );
    }
    return conditions.length ? and(...conditions) : undefined;
  }

  private async writeRelations(
    transaction: Transaction,
    id: string,
    data: TourWriteData,
  ): Promise<void> {
    await transaction
      .insert(tourContent)
      .values({ tourId: id, ...data.content });
    await this.replaceImages(transaction, id, data.galleryImages);
    await this.replaceDestinations(transaction, id, data.destinations);
    await this.replaceDepartures(transaction, id, data.departures);
    await this.replaceTypeDetails(transaction, id, data);
  }

  private async updateRelations(
    transaction: Transaction,
    id: string,
    data: TourUpdateData,
  ): Promise<void> {
    if (data.content) await this.upsertContent(transaction, id, data.content);
    if (data.galleryImages)
      await this.replaceImages(transaction, id, data.galleryImages);
    if (data.destinations)
      await this.replaceDestinations(transaction, id, data.destinations);
    if (data.departures)
      await this.replaceDepartures(transaction, id, data.departures);
    if (this.hasTypeDetails(data))
      await this.replaceTypeDetails(transaction, id, data);
  }

  private async upsertContent(
    transaction: Transaction,
    id: string,
    content: TourWriteData['content'],
  ) {
    await transaction
      .insert(tourContent)
      .values({ tourId: id, ...content })
      .onConflictDoUpdate({
        target: tourContent.tourId,
        set: { ...content, updatedAt: new Date() },
      });
  }

  private async replaceImages(
    transaction: Transaction,
    id: string,
    images: TourWriteData['galleryImages'],
  ) {
    await transaction.delete(tourImages).where(eq(tourImages.tourId, id));
    if (!images.length) return;
    await transaction.insert(tourImages).values(
      images.map((image, sortOrder) => ({
        tourId: id,
        url: image.toString(),
        sortOrder,
      })),
    );
  }

  private async replaceDestinations(
    transaction: Transaction,
    id: string,
    destinations: TourWriteData['destinations'],
  ) {
    await transaction
      .delete(tourDestinations)
      .where(eq(tourDestinations.tourId, id));
    await transaction.insert(tourDestinations).values(
      destinations.map((item, index) => ({
        tourId: id,
        position: index + 1,
        countryId: item.countryId,
        cityId: item.cityId,
        arrivalAirportId: item.arrivalAirportId,
        nights: item.nights,
      })),
    );
  }

  private async replaceDepartures(
    transaction: Transaction,
    id: string,
    departures: TourWriteData['departures'],
  ) {
    await transaction
      .delete(tourDepartures)
      .where(eq(tourDepartures.tourId, id));
    if (!departures.length) return;
    await transaction.insert(tourDepartures).values(
      departures.map((item) => ({
        tourId: id,
        departureDate: item.departureDate.toString(),
        returnDate: item.returnDate?.toString() ?? null,
        departureCityId: item.departureCityId,
        departureAirportId: item.departureAirportId,
        arrivalAirportId: item.arrivalAirportId,
        priceAmount: item.price.amount,
        currency: item.price.currency,
        seatsTotal: item.seatsTotal,
        seatsAvailable: item.seatsAvailable,
      })),
    );
  }

  private async replaceTypeDetails(
    transaction: Transaction,
    id: string,
    data: TourUpdateData,
  ): Promise<void> {
    await transaction
      .delete(tourPackageDetails)
      .where(eq(tourPackageDetails.tourId, id));
    await transaction
      .delete(tourExcursionDetails)
      .where(eq(tourExcursionDetails.tourId, id));
    await transaction
      .delete(tourProgramDays)
      .where(eq(tourProgramDays.tourId, id));
    if (data.type === TourType.PACKAGE && data.packageDetails) {
      await transaction
        .insert(tourPackageDetails)
        .values({ tourId: id, ...data.packageDetails });
    }
    if (data.type === TourType.EXCURSION && data.excursionDetails) {
      await transaction
        .insert(tourExcursionDetails)
        .values({ tourId: id, ...data.excursionDetails });
      if (data.programDays?.length) {
        await transaction
          .insert(tourProgramDays)
          .values(data.programDays.map((day) => ({ tourId: id, ...day })));
      }
    }
  }

  private hasTypeDetails(data: TourUpdateData): boolean {
    return (
      data.type !== undefined ||
      data.packageDetails !== undefined ||
      data.excursionDetails !== undefined ||
      data.programDays !== undefined
    );
  }

  private mergeTypeRelations(
    existing: Tour,
    data: TourUpdateData,
  ): TourUpdateData {
    if (!this.hasTypeDetails(data)) return data;
    return {
      ...data,
      type: data.type ?? existing.type,
      packageDetails:
        data.packageDetails !== undefined
          ? data.packageDetails
          : existing.packageDetails,
      excursionDetails:
        data.excursionDetails !== undefined
          ? data.excursionDetails
          : existing.excursionDetails,
      programDays: data.programDays ?? existing.programDays,
    };
  }

  private toColumns(data: TourWriteData) {
    return {
      slug: data.slug,
      status: data.status,
      type: data.type,
      minTravelers: data.minTravelers,
      maxTravelers: data.maxTravelers,
      durationDays: data.durationDays,
      durationNights: data.durationNights,
      basePriceAmount: data.price.amount,
      currency: data.price.currency,
      coverImageUrl: data.coverImage?.toString() ?? null,
      activeFrom: data.activeFrom?.toString() ?? null,
      activeTo: data.activeTo?.toString() ?? null,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
    };
  }

  private toUpdateColumns(data: TourUpdateData) {
    return {
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.status !== undefined
        ? { status: data.status, publishedAt: this.publishedAt(data.status) }
        : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.minTravelers !== undefined ? { minTravelers: data.minTravelers } : {}),
      ...(data.maxTravelers !== undefined ? { maxTravelers: data.maxTravelers } : {}),
      ...(data.durationDays !== undefined
        ? { durationDays: data.durationDays }
        : {}),
      ...(data.durationNights !== undefined
        ? { durationNights: data.durationNights }
        : {}),
      ...(data.price
        ? { basePriceAmount: data.price.amount, currency: data.price.currency }
        : {}),
      ...(data.coverImage !== undefined
        ? { coverImageUrl: data.coverImage?.toString() ?? null }
        : {}),
      ...(data.activeFrom !== undefined
        ? { activeFrom: data.activeFrom?.toString() ?? null }
        : {}),
      ...(data.activeTo !== undefined
        ? { activeTo: data.activeTo?.toString() ?? null }
        : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    };
  }

  private publishedAt(status: TourStatus): Date | null {
    return status === TourStatus.PUBLISHED ? new Date() : null;
  }

  private sortColumn(sortBy: TourListFilter['sortBy']) {
    return {
      createdAt: tours.createdAt,
      updatedAt: tours.updatedAt,
      sortOrder: tours.sortOrder,
      price: tours.basePriceAmount,
      durationDays: tours.durationDays,
    }[sortBy];
  }
}
