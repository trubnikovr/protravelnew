export interface TtbookingDictionaryItem {
  code?: string;
  name?: string;
}
export interface TtbookingSegment {
  token?: string | number;
  serviceClass?: string;
  bookingClass?: string;
  carrier?: TtbookingDictionaryItem;
  dateBegin?: string;
  dateEnd?: string;
  flightNumber?: string;
  locationBegin?: TtbookingDictionaryItem;
  locationEnd?: TtbookingDictionaryItem;
  terminalBegin?: string;
  terminalEnd?: string;
  travelDuration?: number;
  baggage?: { type?: string; value?: string; allow?: number };
}
export interface TtbookingFlight {
  token?: string | number;
  segments?: { segment?: TtbookingSegment[] };
}
export interface TtbookingItinerary {
  token?: string | number;
  flights?: { flight?: TtbookingFlight[] };
}
export interface TtbookingFlightGroup {
  token?: string | number;
  carrier?: TtbookingDictionaryItem;
  eticket?: boolean;
  latinRegistration?: boolean;
  timeLimit?: string;
  itineraries?: { itinerary?: TtbookingItinerary[] };
  fares?: { fareTotal?: { total?: number | string } };
}
export interface TtbookingFlightResponse {
  respond?: {
    token?: string;
    messages?: unknown;
    flightsGroup?: { flightGroup?: TtbookingFlightGroup[] };
  };
}
export interface TtbookingRulesResponse {
  respond?: {
    remarkGroups?: {
      remarkGroup?: Array<{
        remarks?: {
          remark?: Array<{ code?: string; title?: string; content?: string }>;
        };
      }>;
    };
  };
}
