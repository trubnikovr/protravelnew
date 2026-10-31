import { SupportedLocale } from '@shared/domain/enums';

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
