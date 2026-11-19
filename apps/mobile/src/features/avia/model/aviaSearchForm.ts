export type Place = { code: string; label: string; airportCodes: string[] };
export type Selector =
  | 'departure'
  | 'destination'
  | 'departureDate'
  | 'returnDate';
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';
export type PassengerSelection = typeof defaultPassengers;

export const defaultPassengers = {
  adults: 1,
  children: 0,
  infants: 0,
};

export const cabinClassLabelKey: Record<
  CabinClass,
  'economy' | 'premiumEconomy' | 'business' | 'first'
> = {
  economy: 'economy',
  premium_economy: 'premiumEconomy',
  business: 'business',
  first: 'first',
};

export function dateOptions(offsets: number[]): Date[] {
  return offsets.map(offset => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  });
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  }).format(date);
}

export function toLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const placeOptionsLimit = 5;

export function isExcludedAviaPlace(
  candidate: { code?: string | null; airportCodes?: string[] },
  excludedPlace: Place | null,
): boolean {
  if (!excludedPlace) return false;
  return (
    candidate.code === excludedPlace.code ||
    (candidate.code != null &&
      excludedPlace.airportCodes.includes(candidate.code)) ||
    (candidate.airportCodes?.some(code =>
      excludedPlace.airportCodes.includes(code),
    ) ??
      false)
  );
}
