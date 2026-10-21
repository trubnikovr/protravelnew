import { majorNumberToMinor, minorToMajorNumber } from './payment-amount';

describe('payment amount conversion', () => {
  it('converts minor RUB units without floating point drift', () => {
    expect(minorToMajorNumber('12345')).toBe(123.45);
    expect(majorNumberToMinor(123.45)).toBe('12345');
  });

  it('keeps zero and kopecks', () => {
    expect(minorToMajorNumber('5')).toBe(0.05);
    expect(majorNumberToMinor(0.05)).toBe('5');
  });
});
