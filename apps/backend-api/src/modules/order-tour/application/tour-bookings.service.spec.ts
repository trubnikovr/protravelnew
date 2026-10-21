import { BadRequestException } from '@nestjs/common';
import { CurrencyCode } from '@shared/domain/enums';
import type { CustomerForTourBookingReaderPort } from './customer-for-tour-booking-reader.port';
import type { TourForBookingReaderPort } from './tour-for-booking-reader.port';
import type { TourBookingsRepository } from './tour-bookings.repository';
import type { TravelersForTourBookingReaderPort } from './travelers-for-tour-booking-reader.port';
import { TourBookingsService } from './tour-bookings.service';

describe('TourBookingsService', () => {
  const input = {
    customerId: 'customer-id',
    tourId: 'tour-id',
    travelersCount: 3,
    departureDate: '2026-09-10',
    notes: null,
  };

  it('persists only contract snapshots and calculated total', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'booking-id' });
    const repository = {
      create,
    } as unknown as TourBookingsRepository;
    const customers = {
      get: jest.fn().mockResolvedValue({
        id: 'customer-id',
        name: 'Aziz Karimov',
        phone: '+998901234567',
        email: 'aziz@example.com',
      }),
    } as CustomerForTourBookingReaderPort;
    const tours = {
      get: jest.fn().mockResolvedValue({
        id: 'tour-id',
        title: 'Tashkent tour',
        departureDate: '2026-09-10',
        price: { amount: '250000', currency: CurrencyCode.RUB },
      }),
    } as TourForBookingReaderPort;
    const travelers = { get: jest.fn() } as TravelersForTourBookingReaderPort;

    await new TourBookingsService(
      repository,
      customers,
      tours,
      travelers,
    ).create(input);

    expect(create).toHaveBeenCalledWith({
      ...input,
      totalAmount: '750000',
      currency: CurrencyCode.RUB,
      customerName: 'Aziz Karimov',
      customerPhone: '+998901234567',
      customerEmail: 'aziz@example.com',
      tourTitle: 'Tashkent tour',
      travelers: [],
    });
  });

  it('rejects unavailable boundary references', async () => {
    const repository = {} as TourBookingsRepository;
    const customers = {
      get: jest.fn().mockResolvedValue(null),
    } as CustomerForTourBookingReaderPort;
    const tours = {
      get: jest.fn().mockResolvedValue(null),
    } as TourForBookingReaderPort;
    const travelers = { get: jest.fn() } as TravelersForTourBookingReaderPort;

    await expect(
      new TourBookingsService(repository, customers, tours, travelers).create(
        input,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('uses owned traveler snapshots for customer checkout', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'booking-id' });
    const repository = {
      create,
    } as unknown as TourBookingsRepository;
    const customers = {
      get: jest.fn().mockResolvedValue({
        id: 'customer-id',
        name: 'Aziz Karimov',
        phone: '+998901234567',
        email: null,
      }),
    } as CustomerForTourBookingReaderPort;
    const getTour = jest.fn().mockResolvedValue({
      id: 'tour-id',
      title: 'Tashkent tour',
      departureDate: '2026-09-10',
      price: { amount: '250000', currency: CurrencyCode.RUB },
    });
    const tours = { get: getTour } as TourForBookingReaderPort;
    const snapshot = {
      travelerId: 'traveler-id',
      firstName: 'Aziz',
      lastName: 'Karimov',
      middleName: null,
      gender: 'male' as const,
      birthDate: '1990-01-01',
      citizenshipCountryCode: 'UZ',
    };
    const travelers = {
      get: jest.fn().mockResolvedValue([snapshot]),
    } as TravelersForTourBookingReaderPort;

    await new TourBookingsService(
      repository,
      customers,
      tours,
      travelers,
    ).create({
      ...input,
      travelerIds: ['traveler-id'],
    });

    expect(getTour).toHaveBeenCalledWith('tour-id', '2026-09-10', 1);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        travelersCount: 1,
        travelers: [snapshot],
        totalAmount: '250000',
      }),
    );
  });
});
