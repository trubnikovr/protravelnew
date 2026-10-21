export interface CbsDictionaryItem {
  code?: string;
  name?: string;
}
export interface CbsSegment {
  token?: string;
  serviceClass?: string;
  bookingClass?: string;
  carrier?: CbsDictionaryItem;
  dateBegin?: string;
  dateEnd?: string;
  flightNumber?: string;
  locationBegin?: CbsDictionaryItem;
  locationEnd?: CbsDictionaryItem;
  terminalBegin?: string;
  terminalEnd?: string;
  travelDuration?: number;
  baggage?: { type?: string; value?: string; allow?: number };
}
export interface CbsFlight {
  token?: string;
  segments?: { segment?: CbsSegment[] };
}
export interface CbsItinerary {
  token?: string;
  flights?: { flight?: CbsFlight[] };
}
export interface CbsFlightGroup {
  token?: string;
  carrier?: CbsDictionaryItem;
  eticket?: boolean;
  latinRegistration?: boolean;
  timeLimit?: string;
  itineraries?: { itinerary?: CbsItinerary[] };
  fares?: { fareTotal?: { total?: number | string } };
}
export interface CbsFlightResponse {
  respond?: {
    token?: string;
    flightsGroup?: { flightGroup?: CbsFlightGroup[] };
  };
}
export interface CbsRulesResponse {
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
