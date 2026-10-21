import { CurrencyCode } from '@shared/domain/enums';
import { EntityIdValueObject } from '@shared/domain/value-objects';
import { FlightOrder } from './flight-order';
import { FlightOrderStatus } from './flight-order.types';

describe('FlightOrder', () => {
  function createOrder() {
    return FlightOrder.create({
      customerId: EntityIdValueObject.create(),
      offerId: EntityIdValueObject.create(),
      idempotencyKey: 'test-key',
      provider: 'mock',
      contact: {
        name: 'Test User',
        email: 'test@example.com',
        countryCode: '998',
        areaCode: '90',
        phone: '1234567',
      },
      travelers: [
        {
          travelerId: EntityIdValueObject.create().toString(),
          documentId: EntityIdValueObject.create().toString(),
          passengerType: 'adult',
        },
      ],
      offerSnapshot: {
        carrierCode: 'HY',
        carrierName: 'Аэрофлот',
        itineraries: [],
        totalAmount: '2500000',
        currency: CurrencyCode.RUB,
        offerExpiresAt: new Date(Date.now() + 60_000).toISOString(),
        passengers: [{ type: 'adult', count: 1 }],
        providerReference: {
          searchToken: 'search',
          groupToken: 'group',
          itineraries: [],
        },
      },
    });
  }
  it('moves from draft to booked and cancelled', () => {
    const order = createOrder();
    expect(order.status).toBe(FlightOrderStatus.DRAFT);
    order.startBooking();
    order.confirm({
      providerBookingToken: 'booking',
      recordLocator: 'ABC123',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      providerStatus: 'NEW',
    });
    expect(order.status).toBe(FlightOrderStatus.BOOKED);
    expect(order.recordLocator).toBe('ABC123');
    order.cancel('CANCELLED');
    expect(order.status).toBe(FlightOrderStatus.CANCELLED);
  });
  it('records booking failure', () => {
    const order = createOrder();
    order.startBooking();
    order.fail('FLIGHT_BOOKING_FAILED');
    expect(order.status).toBe(FlightOrderStatus.FAILED);
    expect(order.failureCode).toBe('FLIGHT_BOOKING_FAILED');
  });
  it('moves a booked order through payment', () => {
    const order = createOrder();
    order.startBooking();
    order.confirm({
      providerBookingToken: 'booking',
      recordLocator: 'ABC123',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      providerStatus: 'NEW',
    });
    order.startPayment();
    expect(order.status).toBe(FlightOrderStatus.PAYMENT_PENDING);
    order.markPaid();
    expect(order.status).toBe(FlightOrderStatus.PAID);
  });
});
