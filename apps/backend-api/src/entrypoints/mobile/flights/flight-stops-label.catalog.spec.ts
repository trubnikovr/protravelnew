import { SupportedLocale } from '@shared/domain/enums';
import { flightStopsLabel } from './flight-stops-label.catalog';

describe('flightStopsLabel', () => {
  it.each([
    [0, 'Прямой'],
    [1, '1 пересадка'],
    [2, '2 пересадки'],
    [5, '5 пересадок'],
  ])('formats %i stops in Russian', (stops, expected) => {
    expect(flightStopsLabel(stops, SupportedLocale.RU)).toBe(expected);
  });
});
