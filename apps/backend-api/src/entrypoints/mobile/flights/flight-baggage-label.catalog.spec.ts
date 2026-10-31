import { SupportedLocale } from '@shared/domain/enums';
import { flightBaggageLabel, flightBaggageSummary } from './flight-baggage-label.catalog';

describe('flight baggage presentation', () => {
  it.each([
    ['0PC', 'Без багажа'], ['20KG', 'до 20 кг'],
    ['1PC 23KG', '1 место багажа, до 23 кг'], ['2PC', '2 места багажа'],
    ['11PC', '11 мест багажа'], ['KG', 'Багаж уточняется'],
    [null, 'Багаж уточняется'], ['', 'Багаж уточняется'],
  ])('formats %s on the server', (value, expected) => {
    expect(flightBaggageLabel(value, SupportedLocale.RU)).toBe(expected);
  });
  it('deduplicates segment allowances without hiding unknown segments', () => {
    expect(flightBaggageSummary(['20KG', '20KG', null], SupportedLocale.RU))
      .toBe('до 20 кг · Багаж уточняется');
  });
  it('uses the response locale', () => {
    expect(flightBaggageLabel('0PC', SupportedLocale.EN)).toBe('No baggage');
    expect(flightBaggageLabel('0PC', SupportedLocale.UZ)).toBe('Bagajsiz');
  });
});
