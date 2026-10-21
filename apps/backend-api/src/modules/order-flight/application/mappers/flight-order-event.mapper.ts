import type { FlightOrder } from '../../domain/flight-order';
import { FlightOrderCreatedDomainEvent } from '../../domain/flight-order.events';

export class FlightOrderEventMapper {
  static toCreated(order: FlightOrder): FlightOrderCreatedDomainEvent {
    return new FlightOrderCreatedDomainEvent(order.id.toString(), {
      customerId: order.customerId.toString(),
    });
  }
}
