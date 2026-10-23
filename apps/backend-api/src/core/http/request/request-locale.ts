import type { Request } from 'express';
import { SupportedLocale } from '@shared/domain/enums';

const supported = new Set<string>(Object.values(SupportedLocale));

export function requestLocale(
  request: Request,
  fallback: SupportedLocale = SupportedLocale.RU,
): SupportedLocale {
  const header = request.headers['accept-language'];
  if (!header) return fallback;
  for (const value of header.split(',')) {
    const locale = value.split(';')[0]?.trim().split('-')[0]?.toLowerCase();
    if (locale && supported.has(locale)) return locale as SupportedLocale;
  }
  return fallback;
}
