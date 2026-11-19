import {
  DateTimeValueObject,
  ImageValueObject,
  LocalDateValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import {
  TourStatus,
  TourType,
  type TourContent,
  type TourDeparture,
  type TourDestination,
  type TourExcursionDetails,
  type TourPackageDetails,
  type TourProgramDay,
} from './tour.types';

export interface TourProperties extends DomainEntityProperties {
  slug: string;
  status: TourStatus;
  type: TourType;
  minTravelers: number | null;
  maxTravelers: number | null;
  durationDays: number;
  durationNights: number;
  price: MoneyValueObject;
  coverImage: ImageValueObject | null;
  galleryImages: ImageValueObject[];
  activeFrom: LocalDateValueObject | null;
  activeTo: LocalDateValueObject | null;
  destinations: TourDestination[];
  departures: TourDeparture[];
  packageDetails: TourPackageDetails | null;
  excursionDetails: TourExcursionDetails | null;
  programDays: TourProgramDay[];
  isFeatured: boolean;
  sortOrder: number;
  content: TourContent;
  publishedAt: DateTimeValueObject | null;
}

export class Tour extends DomainEntity<TourProperties> {
  private constructor(private readonly properties: TourProperties) {
    super(properties);
  }

  static restore(properties: TourProperties): Tour {
    if (!properties.destinations.length) {
      throw new Error('Tour must have at least one destination');
    }
    if (
      properties.activeFrom &&
      properties.activeTo &&
      properties.activeFrom.toString() > properties.activeTo.toString()
    ) {
      throw new Error('Tour active period is invalid');
    }
    this.validateDetails(properties);
    this.validateDepartures(properties.departures);
    return new Tour(properties);
  }

  private static validateDetails(properties: TourProperties): void {
    if (properties.type === TourType.PACKAGE && !properties.packageDetails) {
      throw new Error('Package tour details are required');
    }
    if (properties.type === TourType.EXCURSION) {
      if (!properties.excursionDetails) {
        throw new Error('Excursion tour details are required');
      }
      if (!properties.programDays.length) {
        throw new Error('Excursion program is required');
      }
    }
  }

  private static validateDepartures(departures: TourDeparture[]): void {
    for (const departure of departures) {
      if (
        departure.returnDate &&
        departure.returnDate.toString() < departure.departureDate.toString()
      ) {
        throw new Error('Tour return date is before departure date');
      }
      if (
        departure.seatsTotal !== null &&
        departure.seatsAvailable !== null &&
        departure.seatsAvailable > departure.seatsTotal
      ) {
        throw new Error('Available seats exceed total seats');
      }
    }
  }

  get slug() {
    return this.properties.slug;
  }
  get status() {
    return this.properties.status;
  }
  get type() {
    return this.properties.type;
  }
  get minTravelers() {
    return this.properties.minTravelers;
  }
  get maxTravelers() {
    return this.properties.maxTravelers;
  }
  get durationDays() {
    return this.properties.durationDays;
  }
  get durationNights() {
    return this.properties.durationNights;
  }
  get price() {
    return this.properties.price;
  }
  get coverImage() {
    return this.properties.coverImage;
  }
  get galleryImages() {
    return this.properties.galleryImages;
  }
  get activeFrom() {
    return this.properties.activeFrom;
  }
  get activeTo() {
    return this.properties.activeTo;
  }
  get destinations() {
    return this.properties.destinations;
  }
  get departures() {
    return this.properties.departures;
  }
  get packageDetails() {
    return this.properties.packageDetails;
  }
  get excursionDetails() {
    return this.properties.excursionDetails;
  }
  get programDays() {
    return this.properties.programDays;
  }
  get isFeatured() {
    return this.properties.isFeatured;
  }
  get sortOrder() {
    return this.properties.sortOrder;
  }
  get content() {
    return this.properties.content;
  }
  get publishedAt() {
    return this.properties.publishedAt;
  }
}
