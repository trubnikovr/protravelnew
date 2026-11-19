import {
  DateTimeValueObject,
  EntityIdValueObject,
  ImageValueObject,
  LocalDateValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import { Tour } from '../../domain/tour';
import { TourMealType, TourStatus, TourType } from '../../domain/tour.types';
import type {
  TourContentRecord,
  TourDepartureRecord,
  TourDestinationRecord,
  TourExcursionDetailsRecord,
  TourImageRecord,
  TourPackageDetailsRecord,
  TourProgramDayRecord,
  TourRecord,
} from './tour.schema';

export interface TourRecordBundle {
  tour: TourRecord;
  content: TourContentRecord;
  images: TourImageRecord[];
  destinations: Array<
    TourDestinationRecord & {
      countryCode: string | null;
      countryName: string;
      cityName: string | null;
    }
  >;
  departures: TourDepartureRecord[];
  packageDetails: TourPackageDetailsRecord | null;
  excursionDetails: TourExcursionDetailsRecord | null;
  programDays: TourProgramDayRecord[];
}

export class TourPersistenceMapper {
  static toDomain(bundle: TourRecordBundle): Tour {
    const { tour } = bundle;
    return Tour.restore({
      id: EntityIdValueObject.fromString(tour.id),
      slug: tour.slug,
      status: tour.status as TourStatus,
      type: tour.type as TourType,
      minTravelers: tour.minTravelers,
      maxTravelers: tour.maxTravelers,
      durationDays: tour.durationDays,
      durationNights: tour.durationNights,
      price: MoneyValueObject.create(tour.basePriceAmount, tour.currency),
      coverImage: tour.coverImageUrl
        ? ImageValueObject.create(tour.coverImageUrl)
        : null,
      galleryImages: bundle.images.map(({ url }) =>
        ImageValueObject.create(url),
      ),
      activeFrom: tour.activeFrom
        ? LocalDateValueObject.create(tour.activeFrom)
        : null,
      activeTo: tour.activeTo
        ? LocalDateValueObject.create(tour.activeTo)
        : null,
      destinations: bundle.destinations.map((item) => ({
        id: item.id,
        position: item.position,
        countryId: item.countryId,
        countryCode: item.countryCode,
        countryName: item.countryName,
        cityId: item.cityId,
        cityName: item.cityName,
        arrivalAirportId: item.arrivalAirportId,
        nights: item.nights,
      })),
      departures: bundle.departures.map((item) => ({
        id: item.id,
        departureDate: LocalDateValueObject.create(item.departureDate),
        returnDate: item.returnDate
          ? LocalDateValueObject.create(item.returnDate)
          : null,
        departureCityId: item.departureCityId,
        departureAirportId: item.departureAirportId,
        arrivalAirportId: item.arrivalAirportId,
        price: MoneyValueObject.create(item.priceAmount, item.currency),
        seatsTotal: item.seatsTotal,
        seatsAvailable: item.seatsAvailable,
      })),
      packageDetails: bundle.packageDetails
        ? {
            hotelName: bundle.packageDetails.hotelName,
            hotelCategory: bundle.packageDetails.hotelCategory,
            mealType: bundle.packageDetails.mealType as TourMealType,
            transferIncluded: bundle.packageDetails.transferIncluded,
            insuranceIncluded: bundle.packageDetails.insuranceIncluded,
          }
        : null,
      excursionDetails: bundle.excursionDetails
        ? {
            guideLanguage: bundle.excursionDetails.guideLanguage,
            groupSizeMax: bundle.excursionDetails.groupSizeMax,
          }
        : null,
      programDays: bundle.programDays.map((item) => ({
        id: item.id,
        dayNumber: item.dayNumber,
        title: item.title,
        description: item.description,
      })),
      isFeatured: tour.isFeatured,
      sortOrder: tour.sortOrder,
      content: {
        title: bundle.content.title,
        shortDescription: bundle.content.shortDescription,
        description: bundle.content.description,
        inclusions: bundle.content.inclusions,
        exclusions: bundle.content.exclusions,
      },
      publishedAt: tour.publishedAt
        ? DateTimeValueObject.fromDate(tour.publishedAt)
        : null,
      createdAt: DateTimeValueObject.fromDate(tour.createdAt),
      updatedAt: DateTimeValueObject.fromDate(tour.updatedAt),
    });
  }
}
