import type { CurrencyCode } from '@shared/domain/enums';
import type { PaymentPayableType } from '../domain/payment.types';

export const PAYMENT_SUBJECT_READER = Symbol('PAYMENT_SUBJECT_READER');

export interface PaymentSubjectContract {
  id: string;
  type: PaymentPayableType;
  customerId: string;
  title: string;
  amount: string;
  currency: CurrencyCode;
  payable: boolean;
  expiresAt: string | null;
}

export interface PaymentSubjectReaderPort {
  get(
    type: PaymentPayableType,
    id: string,
  ): Promise<PaymentSubjectContract | null>;
  startPayment(type: PaymentPayableType, id: string): Promise<void>;
}
