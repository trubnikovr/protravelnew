export const FLIGHT_SEARCH_QUEUE = Symbol('FLIGHT_SEARCH_QUEUE');

export interface FlightSearchQueuePort {
  enqueue(searchId: string): Promise<void>;
}
