import { CurrencyCode, SupportedLocale } from '../enums';

const LOCALE_MAP: Record<SupportedLocale, string> = {
  [SupportedLocale.RU]: 'ru-RU',
  [SupportedLocale.UZ]: 'uz-UZ',
  [SupportedLocale.EN]: 'en-US',
};

const CURRENCY_FRACTION_DIGITS: Record<CurrencyCode, number> = {
  [CurrencyCode.RUB]: 2,
  [CurrencyCode.USD]: 2,
  [CurrencyCode.EUR]: 2,
};

const WHOLE_CURRENCY_LABELS: Record<
  SupportedLocale,
  Record<CurrencyCode, string>
> = {
  [SupportedLocale.RU]: {
    [CurrencyCode.RUB]: 'руб.',
    [CurrencyCode.USD]: 'долл. США',
    [CurrencyCode.EUR]: 'евро',
  },
  [SupportedLocale.UZ]: {
    [CurrencyCode.RUB]: 'Rossiya rubli',
    [CurrencyCode.USD]: 'AQSH dollari',
    [CurrencyCode.EUR]: 'yevro',
  },
  [SupportedLocale.EN]: {
    [CurrencyCode.RUB]: 'Russian rubles',
    [CurrencyCode.USD]: 'US dollars',
    [CurrencyCode.EUR]: 'euros',
  },
};

export class MoneyValueObject {
  private constructor(
    private readonly amountValue: bigint,
    readonly currency: CurrencyCode,
  ) {}

  static create(
    amount: string | bigint,
    currency: CurrencyCode,
  ): MoneyValueObject {
    const value = typeof amount === 'bigint' ? amount : BigInt(amount);
    if (value < 0n) throw new Error('Money amount cannot be negative');
    return new MoneyValueObject(value, currency);
  }

  get amount(): string {
    return this.amountValue.toString();
  }

  format(locale: SupportedLocale = SupportedLocale.RU): string {
    const fractionDigits = CURRENCY_FRACTION_DIGITS[this.currency];
    const divider = 10n ** BigInt(fractionDigits);
    const integer = this.amountValue / divider;
    const formatter = new Intl.NumberFormat(LOCALE_MAP[locale], {
      maximumFractionDigits: 0,
    });
    const integerFormatted = formatter.format(integer);
    if (!fractionDigits) return `${integerFormatted} ${this.currency}`;
    const fraction = (this.amountValue % divider)
      .toString()
      .padStart(fractionDigits, '0');
    const decimal =
      new Intl.NumberFormat(LOCALE_MAP[locale])
        .formatToParts(1.1)
        .find(({ type }) => type === 'decimal')?.value ?? '.';
    return `${integerFormatted}${decimal}${fraction} ${this.currency}`;
  }

  formatWhole(locale: SupportedLocale = SupportedLocale.RU): string {
    const fractionDigits = CURRENCY_FRACTION_DIGITS[this.currency];
    const divider = 10n ** BigInt(fractionDigits);
    const integer = this.amountValue / divider;
    const remainder = this.amountValue % divider;
    const rounded = remainder * 2n >= divider ? integer + 1n : integer;
    const formatted = new Intl.NumberFormat(LOCALE_MAP[locale], {
      maximumFractionDigits: 0,
    }).format(rounded);
    return `${formatted} ${WHOLE_CURRENCY_LABELS[locale][this.currency]}`;
  }

  toString(): string {
    const fractionDigits = CURRENCY_FRACTION_DIGITS[this.currency];
    if (!fractionDigits) return `${this.amount} ${this.currency}`;
    const padded = this.amount.padStart(fractionDigits + 1, '0');
    return `${padded.slice(0, -fractionDigits)}.${padded.slice(
      -fractionDigits,
    )} ${this.currency}`;
  }
}
