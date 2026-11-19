import type { FlightOrder } from '../domain/flight-order';
export const FLIGHT_ORDER_REPOSITORY = Symbol('FLIGHT_ORDER_REPOSITORY');
export interface FlightOrderRepository {
  reserveBookingAttempt(customerId: string, key: string, requestHash: string): Promise<boolean>;
  bookingAttemptHash(customerId: string, key: string): Promise<string | null>;
  save(order: FlightOrder): Promise<void>;
  findById(customerId: string, id: string): Promise<FlightOrder | null>;
  listByCustomer(customerId: string, page: number, limit: number): Promise<{ items: FlightOrder[]; total: number }>;
  findByOrderId(id: string): Promise<FlightOrder | null>;
  findByIdempotencyKey(
    customerId: string,
    key: string,
  ): Promise<FlightOrder | null>;
}
