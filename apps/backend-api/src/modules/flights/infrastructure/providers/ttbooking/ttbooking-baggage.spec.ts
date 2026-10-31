import { normalizeTtbookingBaggage } from './ttbooking-baggage';

describe('normalizeTtbookingBaggage', () => {
  it.each([
    [{ type: 'KG', allow: 20 }, '20KG'],
    [{ type: 'PC', allow: 1 }, '1PC'],
    [{ type: 'PC', allow: 0 }, '0PC'],
    [{ type: 'kg', value: '23' }, '23KG'],
    [{ value: '2PC' }, '2PC'],
    [{ type: 'KG' }, null],
  ])('normalizes %j to %s', (input, expected) => {
    expect(normalizeTtbookingBaggage(input)).toBe(expected);
  });
});
