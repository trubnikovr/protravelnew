import { SupportedLocale } from '@shared/domain/enums';
import { FlightHighlightType } from '../../domain';

const baggageLabels = {
  [SupportedLocale.RU]: {
    none: 'Без багажа',
    pending: 'Багаж уточняется',
    kg: 'кг',
    upTo: 'до',
  },
  [SupportedLocale.EN]: {
    none: 'No baggage',
    pending: 'Baggage to be confirmed',
    kg: 'kg',
    upTo: 'up to',
  },
  [SupportedLocale.UZ]: {
    none: 'Bagajsiz',
    pending: 'Bagaj aniqlashtirilmoqda',
    kg: 'kg',
    upTo: 'gacha',
  },
};

function pieceLabel(count: number, locale: SupportedLocale): string {
  if (locale === SupportedLocale.EN)
    return `${count} baggage ${count === 1 ? 'piece' : 'pieces'}`;
  if (locale === SupportedLocale.UZ) return `${count} ta bagaj`;
  const last = count % 10;
  const teens = count % 100 >= 11 && count % 100 <= 14;
  const noun =
    !teens && last === 1
      ? 'место'
      : !teens && last >= 2 && last <= 4
      ? 'места'
      : 'мест';
  return `${count} ${noun} багажа`;
}

export function flightBaggageLabel(
  value: string | null | undefined,
  locale: SupportedLocale,
): string {
  const text = baggageLabels[locale];
  const normalized = value?.trim().toUpperCase() ?? '';
  const pieces = normalized.match(/(\d+)\s*PC/);
  const weight = normalized.match(/(\d+(?:[.,]\d+)?)\s*KG/);
  if (pieces && Number(pieces[1]) === 0) return text.none;
  const parts = pieces ? [pieceLabel(Number(pieces[1]), locale)] : [];
  if (weight)
    parts.push(`${text.upTo} ${weight[1].replace(',', '.')} ${text.kg}`);
  return parts.length ? parts.join(', ') : text.pending;
}

export function flightBaggageSummary(
  values: (string | null | undefined)[],
  locale: SupportedLocale,
): string {
  const items = values.length ? values : [null];
  return [
    ...new Set(items.map((value) => flightBaggageLabel(value, locale))),
  ].join(' · ');
}

const highlightLabels: Record<
  SupportedLocale,
  Record<FlightHighlightType, string>
> = {
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
  return highlightLabels[locale][type];
}

export function flightStopsLabel(
  stops: number,
  locale: SupportedLocale,
): string {
  if (stops === 0) {
    return {
      [SupportedLocale.RU]: 'Прямой',
      [SupportedLocale.UZ]: "To'g'ridan-to'g'ri",
      [SupportedLocale.EN]: 'Direct',
    }[locale];
  }
  if (locale === SupportedLocale.EN) {
    return `${stops} ${stops === 1 ? 'stop' : 'stops'}`;
  }
  if (locale === SupportedLocale.UZ) return `${stops} ta to'xtash`;
  const mod10 = stops % 10;
  const mod100 = stops % 100;
  const noun =
    mod10 === 1 && mod100 !== 11
      ? 'пересадка'
      : [2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)
      ? 'пересадки'
      : 'пересадок';
  return `${stops} ${noun}`;
}
