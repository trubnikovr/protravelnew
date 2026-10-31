import { formatFlightDate } from './FlightResultCard';

describe('formatFlightDate', () => {
  it('keeps departure and next-day arrival dates in their local time zones', () => {
    expect(formatFlightDate('2026-10-29T23:30:00-07:00')).toBe('29 окт');
    expect(formatFlightDate('2026-10-30T00:05:00+05:00')).toBe('30 окт');
  });

  it('handles absent or invalid dates without crashing the result list', () => {
    expect(formatFlightDate('')).toBe('');
    expect(formatFlightDate('invalid')).toBe('');
  });
});
