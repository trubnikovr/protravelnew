import type { TtbookingSegment } from './ttbooking.types';

export function normalizeTtbookingBaggage(
  baggage: TtbookingSegment['baggage'],
): string | null {
  if (!baggage) return null;
  const type = baggage.type?.trim().toUpperCase();
  const value = baggage.value?.trim().toUpperCase();
  const amount = baggage.allow ?? numericValue(value);

  if ((type === 'KG' || type === 'PC') && amount !== null) {
    return `${amount}${type}`;
  }
  if (value && /^\d+(?:[.,]\d+)?(?:KG|PC)$/.test(value)) {
    return value.replace(',', '.');
  }
  return null;
}

function numericValue(value?: string): number | null {
  if (!value || !/^\d+(?:[.,]\d+)?$/.test(value)) return null;
  const amount = Number(value.replace(',', '.'));
  return Number.isFinite(amount) ? amount : null;
}
