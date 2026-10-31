import type { HomeContent, HomeDestination, Tour } from '@modules/tours';
import type {
  HomeDestinationResponseDto,
  HomeResponseDto,
  HomeTourResponseDto,
} from './dto/response/home.response.dto';

export class HomeApiMapper {
  static toResponse(content: HomeContent): HomeResponseDto {
    return {
      recommended: content.recommended.map((tour) => this.tour(tour)),
      popularDestinations: content.popularDestinations.map((destination) =>
        this.destination(destination),
      ),
      hotTours: content.hotTours.map((tour) => this.tour(tour)),
    };
  }

  private static tour(tour: Tour): HomeTourResponseDto {
    const destination = tour.destinations[0];
    return {
      id: tour.id.toString(),
      title: tour.content.title,
      location: [destination?.countryName, destination?.cityName]
        .filter(Boolean)
        .join(', '),
      duration: `${tour.durationDays} дн. / ${tour.durationNights} ноч.`,
      price: this.money(tour),
      imageUrl: tour.coverImage?.toString() ?? null,
      hotelCategory: tour.packageDetails?.hotelCategory ?? null,
    };
  }

  private static destination(
    destination: HomeDestination,
  ): HomeDestinationResponseDto {
    return {
      id: destination.id,
      title: destination.title,
      subtitle: destination.subtitle,
      fromPrice: this.money(destination.tour),
      imageUrl: destination.tour.coverImage?.toString() ?? null,
    };
  }

  private static money(tour: Tour) {
    return {
      amount: tour.price.amount,
      currency: tour.price.currency,
      formatted: tour.price.format(),
    };
  }
}
