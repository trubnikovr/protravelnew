import {
  formatTtbookingTime,
  parseTtbookingId,
} from './ttbooking-context';

describe('TTBooking context', () => {
  it('formats time with the required UTC+05:00 offset', () => {
    expect(formatTtbookingTime(new Date('2026-10-22T11:48:17.900Z'))).toBe(
      '2026-10-22T16:48:17+05:00',
    );
  });

  it('converts configured identifiers to numbers', () => {
    expect(parseTtbookingId('7663', 'agency')).toBe(7663);
    expect(parseTtbookingId('10719', 'user')).toBe(10719);
  });

  it('rejects a non-numeric identifier', () => {
    expect(() => parseTtbookingId('invalid', 'agency')).toThrow(
      'agency must be a positive integer',
    );
  });
});
