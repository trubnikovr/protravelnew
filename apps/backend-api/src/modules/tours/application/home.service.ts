import { Injectable } from '@nestjs/common';
import { TourStatus } from '../domain/tour.types';
import type { Tour } from '../domain/tour';
import { ToursService } from './tours.service';

export interface HomeDestination {
  id: string;
  title: string;
  subtitle: string;
  tour: Tour;
}

export interface HomeContent {
  recommended: Tour[];
  popularDestinations: HomeDestination[];
  hotTours: Tour[];
}

@Injectable()
export class HomeService {
  constructor(private readonly tours: ToursService) {}

  async get(): Promise<HomeContent> {
    const [recommended, hot, published] = await Promise.all([
      this.tours.list(this.filter('sortOrder', 2, true)),
      this.tours.list(this.filter('price', 2)),
      this.tours.list(this.filter('sortOrder', 100)),
    ]);
    return {
      recommended: recommended.items,
      popularDestinations: this.popularDestinations(published.items),
      hotTours: hot.items,
    };
  }

  private filter(
    sortBy: 'sortOrder' | 'price',
    limit: number,
    isFeatured?: boolean,
  ) {
    return {
      page: 1,
      limit,
      status: TourStatus.PUBLISHED,
      sortBy,
      sortDirection: 'asc' as const,
      ...(isFeatured === undefined ? {} : { isFeatured }),
    };
  }

  private popularDestinations(tours: Tour[]): HomeDestination[] {
    const destinations = new Map<string, HomeDestination & { count: number }>();
    for (const tour of tours) this.addDestination(destinations, tour);
    return [...destinations.values()]
      .sort((left, right) => right.count - left.count)
      .slice(0, 2)
      .map(({ id, title, subtitle, tour }) => ({ id, title, subtitle, tour }));
  }

  private addDestination(
    destinations: Map<string, HomeDestination & { count: number }>,
    tour: Tour,
  ): void {
    const destination = tour.destinations[0];
    if (!destination) return;
    const id = destination.cityId ?? destination.countryId;
    const current = destinations.get(id);
    if (current) {
      current.count += 1;
      if (BigInt(tour.price.amount) < BigInt(current.tour.price.amount)) {
        current.tour = tour;
      }
      return;
    }
    destinations.set(id, {
      id,
      title: destination.cityName ?? destination.countryName ?? '',
      subtitle: destination.countryName ?? '',
      tour,
      count: 1,
    });
  }
}
