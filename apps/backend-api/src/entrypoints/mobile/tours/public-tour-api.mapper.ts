import type { Tour } from '@modules/tours';
import type {
  PublicTourListItemResponseDto,
  PublicTourResponseDto,
} from './dto/response/public-tour.response.dto';

export class PublicTourApiMapper {
  static toListItem(tour: Tour): PublicTourListItemResponseDto {
    return {
      id: tour.id.toString(),
      slug: tour.slug,
      type: tour.type,
      durationDays: tour.durationDays,
      durationNights: tour.durationNights,
      price: this.money(tour),
      destinations: this.destinations(tour),
      coverImage: tour.coverImage ? { url: tour.coverImage.toString() } : null,
      isFeatured: tour.isFeatured,
      content: tour.content,
    };
  }

  static toResponse(tour: Tour): PublicTourResponseDto {
    return {
      ...this.toListItem(tour),
      departures: tour.departures.map((item) => ({
        departureDate: item.departureDate.toString(),
        returnDate: item.returnDate?.toString() ?? null,
        price: {
          amount: item.price.amount,
          currency: item.price.currency,
          formatted: item.price.format(),
        },
        seatsTotal: item.seatsTotal,
        seatsAvailable: item.seatsAvailable,
      })),
      packageDetails: tour.packageDetails,
      excursionDetails: tour.excursionDetails,
      programDays: tour.programDays.map(
        ({ dayNumber, title, description }) => ({
          dayNumber,
          title,
          description,
        }),
      ),
      galleryImages: tour.galleryImages.map((image) => ({
        url: image.toString(),
      })),
      activeFrom: tour.activeFrom?.toString() ?? null,
      activeTo: tour.activeTo?.toString() ?? null,
    };
  }

  private static destinations(tour: Tour) {
    return tour.destinations.map((item) => ({
      position: item.position,
      countryCode: item.countryCode!,
      countryName: item.countryName!,
      cityName: item.cityName ?? null,
      nights: item.nights,
    }));
  }

  private static money(tour: Tour) {
    return {
      amount: tour.price.amount,
      currency: tour.price.currency,
      formatted: tour.price.format(),
    };
  }
}
