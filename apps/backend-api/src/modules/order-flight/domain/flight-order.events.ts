import { DomainEvent } from '@core/events/domain-event';
import type {
  FlightOrderCreatedEventV1,
  FlightOrderCreatedPayloadV1,
} from '@shared/events';

export class FlightOrderCreatedDomainEvent
  extends DomainEvent<FlightOrderCreatedPayloadV1>
  implements FlightOrderCreatedEventV1
{
  readonly name = 'flight-order.created.v1';
  readonly version = 1;
}
export class FlightOrderBookedDomainEvent extends DomainEvent<{
  recordLocator: string | null;
}> {
  readonly name = 'flight-order.booked';
}
export class FlightOrderBookingFailedDomainEvent extends DomainEvent<{
  code: string | null;
}> {
  readonly name = 'flight-order.booking-failed';
}
export class FlightOrderCancelledDomainEvent extends DomainEvent<{
  providerStatus: string;
}> {
  readonly name = 'flight-order.cancelled';
}
