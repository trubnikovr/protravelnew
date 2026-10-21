import type { Tour } from '../domain/tour';
import type {
  ImageValueObject,
  LocalDateValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import type {
  TourContent,
  TourDeparture,
  TourDestination,
  TourExcursionDetails,
  TourPackageDetails,
  TourProgramDay,
  TourStatus,
  TourType,
} from '../domain/tour.types';

export const TOURS_REPOSITORY = Symbol('TOURS_REPOSITORY');

export interface TourWriteData {
  slug: string;
  status: TourStatus;
  type: TourType;
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
}

export type TourUpdateData = Partial<TourWriteData>;

export interface TourListFilter {
  page: number;
  limit: number;
  status?: TourStatus;
  type?: TourType;
  isFeatured?: boolean;
  search?: string;
  destination?: string;
  sortBy: 'createdAt' | 'updatedAt' | 'sortOrder' | 'price' | 'durationDays';
  sortDirection: 'asc' | 'desc';
}

export interface TourListResult {
  items: Tour[];
  total: number;
}

export interface ToursRepository {
  create(data: TourWriteData): Promise<Tour>;
  findById(id: string): Promise<Tour | null>;
  list(filter: TourListFilter): Promise<TourListResult>;
  update(id: string, data: TourUpdateData): Promise<Tour | null>;
  delete(id: string): Promise<boolean>;
}
