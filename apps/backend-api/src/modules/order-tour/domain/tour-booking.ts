import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import type {
  DateTimeValueObject,
  LocalDateValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import {
  TourBookingStatus,
  type TourBookingDisplay,
  type TourBookingDocument,
  type TourBookingTraveler,
} from './tour-booking.types';

export interface TourBookingProperties extends DomainEntityProperties {
  bookingNumber: string;
  customerId: string;
  tourId: string;
  status: TourBookingStatus;
  travelersCount: number;
  departureDate: LocalDateValueObject | null;
  totalPrice: MoneyValueObject;
  notes: string | null;
  paidAt: DateTimeValueObject | null;
  display: TourBookingDisplay;
  documents: TourBookingDocument[];
  travelers: TourBookingTraveler[];
}

const transitions: Record<TourBookingStatus, TourBookingStatus[]> = {
  [TourBookingStatus.PENDING]: [
    TourBookingStatus.CONFIRMED,
    TourBookingStatus.CANCELLED,
  ],
  [TourBookingStatus.CONFIRMED]: [
    TourBookingStatus.AWAITING_PAYMENT,
    TourBookingStatus.CANCELLED,
  ],
  [TourBookingStatus.AWAITING_PAYMENT]: [
    TourBookingStatus.PAID,
    TourBookingStatus.CANCELLED,
  ],
  [TourBookingStatus.PAID]: [
    TourBookingStatus.COMPLETED,
    TourBookingStatus.CANCELLED,
  ],
  [TourBookingStatus.COMPLETED]: [],
  [TourBookingStatus.CANCELLED]: [],
};

export class TourBooking extends DomainEntity<TourBookingProperties> {
  static restore(properties: TourBookingProperties): TourBooking {
    return new TourBooking(properties);
  }

  changeStatus(status: TourBookingStatus): void {
    if (status === this.status) return;
    if (!transitions[this.status].includes(status)) {
      throw new Error(
        `Tour booking cannot change from ${this.status} to ${status}`,
      );
    }
    this.entityProperties.status = status;
  }

  get bookingNumber() {
    return this.entityProperties.bookingNumber;
  }
  get customerId() {
    return this.entityProperties.customerId;
  }
  get tourId() {
    return this.entityProperties.tourId;
  }
  get status() {
    return this.entityProperties.status;
  }
  get travelersCount() {
    return this.entityProperties.travelersCount;
  }
  get departureDate() {
    return this.entityProperties.departureDate;
  }
  get totalPrice() {
    return this.entityProperties.totalPrice;
  }
  get notes() {
    return this.entityProperties.notes;
  }
  get paidAt() {
    return this.entityProperties.paidAt;
  }
  get display() {
    return this.entityProperties.display;
  }
  get documents() {
    return this.entityProperties.documents;
  }
  get travelers() {
    return this.entityProperties.travelers;
  }
}
