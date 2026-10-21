import {
  FlightCabinClass,
  FlightPassengerType,
  FlightSearch,
  FlightSearchStatus,
} from './index';

describe('FlightSearch', () => {
  const criteria = {
    routes: [
      { origin: 'MOW', destination: 'IST', departureDate: '2027-01-10' },
    ],
    passengers: [{ type: FlightPassengerType.ADULT, count: 1 }],
    cabinClass: FlightCabinClass.ECONOMY,
    directOnly: false,
    baggageRequired: false,
    preferredAirlines: [],
  };

  it('moves through the asynchronous search lifecycle', () => {
    const search = FlightSearch.create(criteria, 1_800);
    expect(search.status).toBe(FlightSearchStatus.CREATED);
    search.markRunning();
    expect(search.status).toBe(FlightSearchStatus.RUNNING);
    expect(search.progress).toBe(20);
    search.complete();
    expect(search.status).toBe(FlightSearchStatus.COMPLETED);
    expect(search.progress).toBe(100);
  });

  it('records a stable provider failure code', () => {
    const search = FlightSearch.create(criteria, 1_800);
    search.fail('PROVIDER_UNAVAILABLE');
    expect(search.status).toBe(FlightSearchStatus.FAILED);
    expect(search.errorCode).toBe('PROVIDER_UNAVAILABLE');
  });
});
