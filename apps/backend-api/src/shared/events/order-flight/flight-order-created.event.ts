export interface FlightOrderCreatedPayloadV1 {
  customerId: string;
}

export interface FlightOrderCreatedEventV1 {
  readonly eventId: string;
  readonly name: 'flight-order.created.v1';
  readonly version: 1;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: FlightOrderCreatedPayloadV1;
}
