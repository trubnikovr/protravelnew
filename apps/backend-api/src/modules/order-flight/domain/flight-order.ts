import { DomainEntity } from '@shared/domain/entities';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import type {
  FlightBookingResult,
  FlightOrderContact,
  FlightOrderOfferSnapshot,
  FlightOrderTravelerSelection,
} from './flight-order.types';
import { FlightOrderStatus } from './flight-order.types';

export interface FlightOrderProperties {
  id: EntityIdValueObject;
  createdAt: DateTimeValueObject;
  updatedAt: DateTimeValueObject;
  customerId: EntityIdValueObject;
  offerId: EntityIdValueObject;
  idempotencyKey: string;
  status: FlightOrderStatus;
  provider: string;
  contact: FlightOrderContact;
  travelers: FlightOrderTravelerSelection[];
  offerSnapshot: FlightOrderOfferSnapshot;
  providerBookingToken: string | null;
  recordLocator: string | null;
  bookingExpiresAt: DateTimeValueObject | null;
  providerStatus: string | null;
  failureCode: string | null;
}

type NewFlightOrderProperties = Omit<
  FlightOrderProperties,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'providerBookingToken'
  | 'recordLocator'
  | 'bookingExpiresAt'
  | 'providerStatus'
  | 'failureCode'
>;

export class FlightOrder extends DomainEntity<FlightOrderProperties> {
  static create(input: NewFlightOrderProperties): FlightOrder {
    const now = DateTimeValueObject.now();
    return new FlightOrder({
      ...input,
      id: EntityIdValueObject.create(),
      createdAt: now,
      updatedAt: now,
      status: FlightOrderStatus.DRAFT,
      providerBookingToken: null,
      recordLocator: null,
      bookingExpiresAt: null,
      providerStatus: null,
      failureCode: null,
    });
  }

  static restore(properties: FlightOrderProperties): FlightOrder {
    return new FlightOrder(properties);
  }

  get customerId() {
    return this.entityProperties.customerId;
  }

  get offerId() {
    return this.entityProperties.offerId;
  }

  get idempotencyKey() {
    return this.entityProperties.idempotencyKey;
  }

  get status() {
    return this.entityProperties.status;
  }

  get provider() {
    return this.entityProperties.provider;
  }

  get contact() {
    return this.entityProperties.contact;
  }

  get travelers(): readonly FlightOrderTravelerSelection[] {
    return this.entityProperties.travelers;
  }

  get offerSnapshot() {
    return this.entityProperties.offerSnapshot;
  }

  get providerBookingToken() {
    return this.entityProperties.providerBookingToken;
  }

  get recordLocator() {
    return this.entityProperties.recordLocator;
  }

  get bookingExpiresAt() {
    return this.entityProperties.bookingExpiresAt;
  }

  get providerStatus() {
    return this.entityProperties.providerStatus;
  }

  get failureCode() {
    return this.entityProperties.failureCode;
  }

  startBooking(): void {
    if (
      ![FlightOrderStatus.DRAFT, FlightOrderStatus.FAILED].includes(this.status)
    ) {
      throw new Error('Flight order cannot start booking');
    }

    this.entityProperties.status = FlightOrderStatus.BOOKING;
    this.entityProperties.failureCode = null;
    this.touch();
  }

  confirm(result: FlightBookingResult): void {
    if (result.totalAmount !== undefined) {
      this.entityProperties.offerSnapshot = { ...this.offerSnapshot, totalAmount: result.totalAmount };
    }
    this.entityProperties.status = FlightOrderStatus.BOOKED;
    this.entityProperties.providerBookingToken = result.providerBookingToken;
    this.entityProperties.recordLocator = result.recordLocator;
    this.entityProperties.bookingExpiresAt = this.bookingExpiry(result);
    this.entityProperties.providerStatus = result.providerStatus;
    this.touch();
  }

  private bookingExpiry(result: FlightBookingResult) {
    return result.expiresAt
      ? DateTimeValueObject.fromISOString(result.expiresAt)
      : null;
  }

  fail(code: string): void {
    this.entityProperties.status = FlightOrderStatus.FAILED;
    this.entityProperties.failureCode = code;
    this.touch();
  }

  startPayment(): void {
    if (this.status === FlightOrderStatus.PAYMENT_PENDING) return;
    if (this.status !== FlightOrderStatus.BOOKED) {
      throw new Error('Flight order is not ready for payment');
    }
    this.entityProperties.status = FlightOrderStatus.PAYMENT_PENDING;
    this.touch();
  }

  markPaid(): void {
    if (this.status === FlightOrderStatus.PAID) return;
    if (this.status !== FlightOrderStatus.PAYMENT_PENDING) {
      throw new Error('Flight order has no pending payment');
    }
    this.entityProperties.status = FlightOrderStatus.PAID;
    this.touch();
  }

  cancel(providerStatus: string): void {
    this.entityProperties.status = FlightOrderStatus.CANCELLED;
    this.entityProperties.providerStatus = providerStatus;
    this.touch();
  }

  private touch(): void {
    this.entityProperties.updatedAt = DateTimeValueObject.now();
  }
}
