export type CurrencyCodeContract = 'RUB' | 'USD' | 'EUR';

export type FlightPassengerTypeContract = 'adult' | 'child' | 'infant';

export interface FlightPassengerGroupContract {
  type: FlightPassengerTypeContract;
  count: number;
}

export interface FlightProviderReferenceContract {
  searchToken: string;
  groupToken: string | number;
  itineraries: Array<{
    itineraryToken: string | number;
    flightToken: string | number;
    segmentTokens: Array<string | number>;
  }>;
}

export interface FlightOfferForOrderContract {
  id: string;
  provider: string;
  validatingCarrierCode: string;
  validatingCarrierName: string;
  itineraries: unknown[];
  totalAmount: string;
  currency: CurrencyCodeContract;
  expiresAt: string;
  providerReference: FlightProviderReferenceContract;
  passengers: FlightPassengerGroupContract[];
}
