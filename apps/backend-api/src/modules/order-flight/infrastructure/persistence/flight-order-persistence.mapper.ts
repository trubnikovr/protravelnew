import { CurrencyCode } from '@shared/domain/enums';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import { FlightOrder } from '../../domain/flight-order';
import type { FlightOrderRecord } from './flight-order.schema';

export class FlightOrderPersistenceMapper {
  static toDomain(record: FlightOrderRecord): FlightOrder {
    return FlightOrder.restore({
      ...this.identity(record),
      ...this.business(record),
      ...this.booking(record),
      ...this.timestamps(record),
    });
  }

  private static identity(record: FlightOrderRecord) {
    return {
      id: EntityIdValueObject.fromString(record.id),
      customerId: EntityIdValueObject.fromString(record.customerId),
      offerId: EntityIdValueObject.fromString(record.offerId),
      idempotencyKey: record.idempotencyKey,
    };
  }

  private static business(record: FlightOrderRecord) {
    return {
      status: record.status,
      provider: record.provider,
      contact: record.contact,
      travelers: record.travelers,
      offerSnapshot: this.offerSnapshot(record),
    };
  }

  private static offerSnapshot(record: FlightOrderRecord) {
    return {
      ...record.offerSnapshot,
      totalAmount: record.totalAmount,
      currency: record.currency as CurrencyCode,
    };
  }

  private static booking(record: FlightOrderRecord) {
    return {
      providerBookingToken: record.providerBookingToken,
      recordLocator: record.recordLocator,
      bookingExpiresAt: record.bookingExpiresAt
        ? DateTimeValueObject.fromDate(record.bookingExpiresAt)
        : null,
      providerStatus: record.providerStatus,
      failureCode: record.failureCode,
    };
  }

  private static timestamps(record: FlightOrderRecord) {
    return {
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    };
  }
}
