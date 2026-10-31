import { FlightHighlightType } from '@modules/flights';
import { SupportedLocale } from '@shared/domain/enums';
import { flightHighlightLabel } from './flight-highlight-label.catalog';

describe('flightHighlightLabel', () => {
  it.each([
    [SupportedLocale.RU, FlightHighlightType.CHEAPEST, 'Самый дешёвый'],
    [SupportedLocale.UZ, FlightHighlightType.FASTEST, 'Eng tez'],
    [SupportedLocale.EN, FlightHighlightType.CHEAPEST, 'Cheapest'],
  ])('localizes %s highlight', (locale, type, expected) => {
    expect(flightHighlightLabel(type, locale)).toBe(expected);
  });
});
