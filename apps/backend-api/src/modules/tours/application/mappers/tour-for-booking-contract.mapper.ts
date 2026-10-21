import type { TourForBookingContract } from '@shared/contracts';
import type { Tour } from '../../domain/tour';
import type { TourDeparture } from '../../domain/tour.types';

export class TourForBookingContractMapper {
  static toContract(
    tour: Tour,
    departure: TourDeparture | null,
  ): TourForBookingContract {
    const price = departure?.price ?? tour.price;
    return {
      id: tour.id.toString(),
      title: tour.content.title,
      departureDate: departure?.departureDate.toString() ?? null,
      price: { amount: price.amount, currency: price.currency },
    };
  }
}
