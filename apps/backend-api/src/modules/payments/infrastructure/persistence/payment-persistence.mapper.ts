import { Payment } from '../../domain/payment';
import {
  DateTimeValueObject,
  EntityIdValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import type { PaymentRecord } from './payment.schema';

export class PaymentPersistenceMapper {
  static toDomain(record: PaymentRecord): Payment {
    return Payment.restore({
      id: EntityIdValueObject.fromString(record.id),
      customerId: record.customerId,
      payableType: record.payableType,
      payableId: record.payableId,
      idempotencyKey: record.idempotencyKey,
      status: record.status,
      amount: MoneyValueObject.create(record.totalAmount, record.currency),
      provider: record.provider,
      providerOrderId: record.providerOrderId,
      providerPaymentId: record.providerPaymentId,
      paymentMethod: record.paymentMethod,
      paymentUrl: record.paymentUrl,
      expiresAt: DateTimeValueObject.fromDate(record.expiresAt),
      paidAt: record.paidAt
        ? DateTimeValueObject.fromDate(record.paidAt)
        : null,
      failureCode: record.failureCode,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    });
  }
}
