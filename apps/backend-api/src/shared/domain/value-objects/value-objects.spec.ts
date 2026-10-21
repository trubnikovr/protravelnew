import {
  DateTimeValueObject,
  EmailValueObject,
  EntityIdValueObject,
  ImageValueObject,
  LocalDateValueObject,
  LoginValueObject,
  MoneyValueObject,
  TimeZoneValueObject,
} from './index';
import { CurrencyCode, SupportedLocale } from '../enums';

describe('shared domain value objects', () => {
  it('normalizes emails', () => {
    expect(EmailValueObject.create(' Admin@ProTravel.UZ ').toString()).toBe(
      'admin@protravel.uz',
    );
  });

  it('normalizes logins', () => {
    expect(LoginValueObject.create(' Admin.Root ').toString()).toBe(
      'admin.root',
    );
  });

  it('rejects invalid logins', () => {
    expect(() => LoginValueObject.create('1')).toThrow(
      'Login value is invalid',
    );
  });

  it('keeps dates immutable', () => {
    const source = new Date('2026-08-01T10:00:00.000Z');
    const value = DateTimeValueObject.fromDate(source);
    source.setFullYear(2030);
    expect(value.toISOString()).toBe('2026-08-01T10:00:00.000Z');
    expect(value.toString()).toBe('2026-08-01T10:00:00.000Z');
  });

  it('keeps calendar dates independent from a time zone', () => {
    expect(LocalDateValueObject.create('2026-08-05').toString()).toBe(
      '2026-08-05',
    );
    expect(() => LocalDateValueObject.create('2026-02-30')).toThrow();
  });

  it('validates IANA time zones and formats UTC instants in them', () => {
    const timeZone = TimeZoneValueObject.create('Europe/Moscow');
    const date = DateTimeValueObject.fromISOString('2026-08-05T08:00:00.000Z');
    expect(timeZone.toString()).toBe('Europe/Moscow');
    expect(date.format(timeZone.toString(), 'en-GB')).toContain('11:00:00');
  });

  it('formats money from integer minor units', () => {
    expect(MoneyValueObject.create('12500000', CurrencyCode.RUB).format()).toBe(
      '125 000,00 RUB',
    );
    expect(
      MoneyValueObject.create('125050', CurrencyCode.USD).format(
        SupportedLocale.RU,
      ),
    ).toBe('1\u00a0250,50 USD');
    expect(MoneyValueObject.create('5', CurrencyCode.USD).toString()).toBe(
      '0.05 USD',
    );
  });

  it('normalizes image URLs', () => {
    expect(
      ImageValueObject.create('https://cdn.example.com/a.jpg').toString(),
    ).toBe('https://cdn.example.com/a.jpg');
  });

  it('creates valid entity ids', () => {
    const id = EntityIdValueObject.create();
    expect(EntityIdValueObject.fromString(id.toString()).equals(id)).toBe(true);
  });
});
