import type { FlightPassengerTypeContract } from '@shared/contracts';
import { FlightCabinClass } from '@modules/flights/domain/flight.types';

export enum CbsCommand {
  SEARCH_FLIGHTS_RELEASE = 'SEARCHFR',
  SELECT_FLIGHT_RELEASE = 'SELECTFR',
  CREATE_BOOKING_RELEASE = 'CREATEBR',
  LOAD_BOOKING = 'LOADBOOKING',
  CANCEL_BOOKING = 'CANCELBOOKING',
}

export enum CbsGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum CbsPassportType {
  INTERNAL = 'INTERNAL',
  FOREIGN = 'FOREIGN',
  BIRTH_CERTIFICATE = 'BIRTHDAY_NOTIFICATION',
  PASSPORT = 'PASSPORT',
}

export enum CbsPassengerType {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT',
}

export enum CbsServiceClass {
  ECONOMY = 'ECONOMY',
  PREMIUM = 'PREMIUM',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

export const CBS_PASSENGER_TYPE_BY_DOMAIN: Readonly<
  Record<FlightPassengerTypeContract, CbsPassengerType>
> = {
  adult: CbsPassengerType.ADULT,
  child: CbsPassengerType.CHILD,
  infant: CbsPassengerType.INFANT,
};

export const CBS_SERVICE_CLASS_BY_DOMAIN: Readonly<
  Record<FlightCabinClass, CbsServiceClass>
> = {
  [FlightCabinClass.ECONOMY]: CbsServiceClass.ECONOMY,
  [FlightCabinClass.PREMIUM_ECONOMY]: CbsServiceClass.PREMIUM,
  [FlightCabinClass.BUSINESS]: CbsServiceClass.BUSINESS,
  [FlightCabinClass.FIRST]: CbsServiceClass.FIRST,
};

export const DOMAIN_CABIN_CLASS_BY_CBS: Readonly<
  Record<CbsServiceClass, FlightCabinClass>
> = {
  [CbsServiceClass.ECONOMY]: FlightCabinClass.ECONOMY,
  [CbsServiceClass.PREMIUM]: FlightCabinClass.PREMIUM_ECONOMY,
  [CbsServiceClass.BUSINESS]: FlightCabinClass.BUSINESS,
  [CbsServiceClass.FIRST]: FlightCabinClass.FIRST,
};
