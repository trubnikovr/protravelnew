import { FlightHighlightType } from '@modules/flights';
import { SupportedLocale } from '@shared/domain/enums';

const labels: Record<SupportedLocale, Record<FlightHighlightType, string>> = {
  [SupportedLocale.RU]: {
    [FlightHighlightType.CHEAPEST]: 'Самый дешёвый',
    [FlightHighlightType.FASTEST]: 'Самый быстрый',
  },
  [SupportedLocale.UZ]: {
    [FlightHighlightType.CHEAPEST]: 'Eng arzon',
    [FlightHighlightType.FASTEST]: 'Eng tez',
  },
  [SupportedLocale.EN]: {
    [FlightHighlightType.CHEAPEST]: 'Cheapest',
    [FlightHighlightType.FASTEST]: 'Fastest',
  },
};

export function flightHighlightLabel(
  type: FlightHighlightType,
  locale: SupportedLocale,
): string {
  return labels[locale][type];
}
