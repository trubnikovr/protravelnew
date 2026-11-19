import { BadRequestException, Injectable } from '@nestjs/common';
import type { TourForBookingContract } from '@shared/contracts';
import { TourStatus } from '../../domain/tour.types';
import { ToursService } from '../tours.service';
import { TourForBookingContractMapper } from '../mappers/tour-for-booking-contract.mapper';

@Injectable()
export class GetTourForBookingUseCase {
  constructor(private readonly tours: ToursService) {}

  async execute(
    tourId: string,
    departureDate: string | null,
    travelersCount: number,
  ): Promise<TourForBookingContract | null> {
    const tour = await this.tours.findById(tourId);
    if (!tour || tour.status !== TourStatus.PUBLISHED) return null;
    if ((tour.minTravelers !== null && travelersCount < tour.minTravelers) ||
        (tour.maxTravelers !== null && travelersCount > tour.maxTravelers)) {
      throw new BadRequestException({ code: 'TOUR_TRAVELER_COUNT_INVALID', message: 'Traveler count is outside tour limits' });
    }
    const departure = departureDate
      ? (tour.departures.find(
          (item) => item.departureDate.toString() === departureDate,
        ) ?? null)
      : null;
    if (departureDate && !departure) return null;
    if (
      departure &&
      departure.seatsAvailable !== null &&
      departure.seatsAvailable < travelersCount
    ) {
      return null;
    }
    return TourForBookingContractMapper.toContract(tour, departure);
  }
}
