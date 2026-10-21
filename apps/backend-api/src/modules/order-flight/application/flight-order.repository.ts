import type { FlightOrder } from '../domain/flight-order';
export const FLIGHT_ORDER_REPOSITORY = Symbol('FLIGHT_ORDER_REPOSITORY');
export interface FlightOrderRepository {
  save(order: FlightOrder): Promise<void>;
  findById(customerId: string, id: string): Promise<FlightOrder | null>;
  findByOrderId(id: string): Promise<FlightOrder | null>;
  findByIdempotencyKey(
    customerId: string,
    key: string,
  ): Promise<FlightOrder | null>;
}
