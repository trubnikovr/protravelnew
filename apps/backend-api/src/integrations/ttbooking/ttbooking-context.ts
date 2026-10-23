const TTBOOKING_TIME_OFFSET_HOURS = 5;

export function formatTtbookingTime(date = new Date()): string {
  const localTime = new Date(
    date.getTime() + TTBOOKING_TIME_OFFSET_HOURS * 60 * 60 * 1_000,
  );
  return localTime.toISOString().replace(/\.\d{3}Z$/, '+05:00');
}

export function parseTtbookingId(value: string, name: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return id;
}
