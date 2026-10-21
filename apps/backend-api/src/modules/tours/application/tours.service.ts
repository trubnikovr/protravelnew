import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { Tour } from '../domain/tour';
import { ReferenceService } from '@core/submodules/reference';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import {
  TourCreatedDomainEvent,
  TourDeletedDomainEvent,
  TourUpdatedDomainEvent,
} from '../domain/tour.events';
import {
  TOURS_REPOSITORY,
  type TourListFilter,
  type TourListResult,
  type ToursRepository,
  type TourUpdateData,
  type TourWriteData,
} from './tours.repository';

@Injectable()
export class ToursService {
  constructor(
    @Inject(TOURS_REPOSITORY)
    private readonly repository: ToursRepository,
    private readonly events: DomainEventPublisher,
    private readonly reference: ReferenceService,
  ) {}

  list(filter: TourListFilter): Promise<TourListResult> {
    return this.repository.list(filter);
  }

  findById(id: string): Promise<Tour | null> {
    return this.repository.findById(id);
  }

  async create(data: TourWriteData): Promise<Tour> {
    await this.validateDestinations(data.destinations);
    try {
      const tour = await this.repository.create(data);
      this.events.publish(
        new TourCreatedDomainEvent(tour.id.toString(), { status: tour.status }),
      );
      return tour;
    } catch (error) {
      this.rethrowConflict(error);
    }
  }

  async update(id: string, data: TourUpdateData): Promise<Tour | null> {
    if (data.destinations) await this.validateDestinations(data.destinations);
    try {
      const tour = await this.repository.update(id, data);
      if (tour) {
        this.events.publish(
          new TourUpdatedDomainEvent(tour.id.toString(), {
            status: tour.status,
          }),
        );
      }
      return tour;
    } catch (error) {
      this.rethrowConflict(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    if (deleted) this.events.publish(new TourDeletedDomainEvent(id, {}));
    return deleted;
  }

  private rethrowConflict(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw new ConflictException({
        code: 'TOUR_SLUG_CONFLICT',
        message: 'A tour with this slug already exists',
      });
    }
    throw error;
  }

  private async validateDestinations(
    destinations: TourWriteData['destinations'],
  ): Promise<void> {
    const unique = new Set(
      destinations.map(
        ({ countryId, cityId }) => `${countryId}:${cityId ?? ''}`,
      ),
    );
    const valid = await Promise.all(
      destinations.map(({ countryId, cityId }) =>
        this.reference.destinationExists(countryId, cityId),
      ),
    );
    if (unique.size === destinations.length && valid.every(Boolean)) return;
    throw new BadRequestException({
      code: 'TOUR_DESTINATIONS_INVALID',
      message:
        'Tour destinations must contain unique valid country and city pairs',
    });
  }
}
