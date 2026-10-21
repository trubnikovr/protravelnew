import type { CurrencyCode } from '@shared/domain/enums';

export interface TourForBookingContract {
  id: string;
  title: string;
  departureDate: string | null;
  price: {
    amount: string;
    currency: CurrencyCode;
  };
}
