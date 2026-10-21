import { CurrencyCode } from '@shared/domain/enums';
import {
  DateTimeValueObject,
  EntityIdValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import { TourBooking } from './tour-booking';
import { TourBookingStatus } from './tour-booking.types';

describe('TourBooking', () => {
  function booking(status = TourBookingStatus.PENDING) {
    const now = DateTimeValueObject.now();
    return TourBooking.restore({
      id: EntityIdValueObject.create(),
      createdAt: now,
      updatedAt: now,
      bookingNumber: 'PT-20260818-TEST0001',
      customerId: EntityIdValueObject.create().toString(),
      tourId: EntityIdValueObject.create().toString(),
      status,
      travelersCount: 2,
      departureDate: null,
      totalPrice: MoneyValueObject.create('5000000', CurrencyCode.RUB),
      notes: null,
      paidAt: null,
      display: {
        tourTitle: 'Test tour',
        customerName: 'Test Customer',
        customerPhone: '+998901234567',
        customerEmail: 'customer@example.com',
      },
      documents: [],
      travelers: [],
    });
  }

  it('moves through confirmation, payment and completion', () => {
    const item = booking();
    item.changeStatus(TourBookingStatus.CONFIRMED);
    item.changeStatus(TourBookingStatus.AWAITING_PAYMENT);
    item.changeStatus(TourBookingStatus.PAID);
    item.changeStatus(TourBookingStatus.COMPLETED);
    expect(item.status).toBe(TourBookingStatus.COMPLETED);
  });

  it('rejects a payment before confirmation', () => {
    const item = booking();
    expect(() => item.changeStatus(TourBookingStatus.PAID)).toThrow(
      'Tour booking cannot change from pending to paid',
    );
  });

  it('allows cancellation of a paid booking', () => {
    const item = booking(TourBookingStatus.PAID);
    item.changeStatus(TourBookingStatus.CANCELLED);
    expect(item.status).toBe(TourBookingStatus.CANCELLED);
  });
});
