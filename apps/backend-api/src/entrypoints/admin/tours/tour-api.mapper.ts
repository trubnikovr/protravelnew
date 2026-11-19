import type { Tour } from '@modules/tours';
import type { TourResponseDto } from './dto/response/tour.response.dto';

export class TourApiMapper {
  static toResponse(tour: Tour): TourResponseDto {
    return {
      id: tour.id.toString(),
      slug: tour.slug,
      status: tour.status,
      type: tour.type,
      minTravelers: tour.minTravelers,
      maxTravelers: tour.maxTravelers,
      durationDays: tour.durationDays,
      durationNights: tour.durationNights,
      price: this.money(tour.price),
      destinations: tour.destinations.map((item) => ({
        id: item.id!,
        position: item.position,
        countryId: item.countryId,
        countryCode: item.countryCode ?? null,
        countryName: item.countryName!,
        cityId: item.cityId,
        cityName: item.cityName ?? null,
        arrivalAirportId: item.arrivalAirportId,
        nights: item.nights,
      })),
      departures: tour.departures.map((item) => ({
        id: item.id!,
        departureDate: item.departureDate.toString(),
        returnDate: item.returnDate?.toString() ?? null,
        departureCityId: item.departureCityId,
        departureAirportId: item.departureAirportId,
        arrivalAirportId: item.arrivalAirportId,
        price: this.money(item.price),
        seatsTotal: item.seatsTotal,
        seatsAvailable: item.seatsAvailable,
      })),
      packageDetails: tour.packageDetails,
      excursionDetails: tour.excursionDetails,
      programDays: tour.programDays.map((item) => ({
        id: item.id!,
        dayNumber: item.dayNumber,
        title: item.title,
        description: item.description,
      })),
      coverImage: tour.coverImage ? { url: tour.coverImage.toString() } : null,
      galleryImages: tour.galleryImages.map((image) => ({
        url: image.toString(),
      })),
      activeFrom: tour.activeFrom?.toString() ?? null,
      activeTo: tour.activeTo?.toString() ?? null,
      isFeatured: tour.isFeatured,
      sortOrder: tour.sortOrder,
      content: tour.content,
      publishedAt: tour.publishedAt?.toString() ?? null,
      createdAt: tour.createdAt.toString(),
      updatedAt: tour.updatedAt.toString(),
    };
  }

  private static money(value: Tour['price']) {
    return {
      amount: value.amount,
      currency: value.currency,
      formatted: value.formatWhole(),
    };
  }
}
