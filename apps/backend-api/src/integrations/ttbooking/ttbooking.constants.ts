import type { FlightPassengerTypeContract } from '@shared/contracts';
import { FlightCabinClass } from '@modules/flights/domain/flight.types';

export enum TtbookingCommand {
  SEARCH_FLIGHTS_RELEASE = 'SEARCHFR',
  SELECT_FLIGHT_RELEASE = 'SELECTFR',
  CREATE_BOOKING_RELEASE = 'CREATEBR',
  LOAD_BOOKING = 'LOADBOOKING',
  CANCEL_BOOKING = 'CANCELBOOKING',
}

export enum TtbookingGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum TtbookingPassportType {
  INTERNAL = 'INTERNAL',
  FOREIGN = 'FOREIGN',
  BIRTH_CERTIFICATE = 'BIRTHDAY_NOTIFICATION',
  PASSPORT = 'PASSPORT',
}

export enum TtbookingPassengerType {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT',
}

export enum TtbookingServiceClass {
  ECONOMY = 'ECONOMY',
  PREMIUM = 'PREMIUM',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

export const TTBOOKING_PASSENGER_TYPE_BY_DOMAIN: Readonly<
  Record<FlightPassengerTypeContract, TtbookingPassengerType>
> = {
  adult: TtbookingPassengerType.ADULT,
  child: TtbookingPassengerType.CHILD,
  infant: TtbookingPassengerType.INFANT,
};

export const TTBOOKING_SERVICE_CLASS_BY_DOMAIN: Readonly<
  Record<FlightCabinClass, TtbookingServiceClass>
> = {
  [FlightCabinClass.ECONOMY]: TtbookingServiceClass.ECONOMY,
  [FlightCabinClass.PREMIUM_ECONOMY]: TtbookingServiceClass.PREMIUM,
  [FlightCabinClass.BUSINESS]: TtbookingServiceClass.BUSINESS,
  [FlightCabinClass.FIRST]: TtbookingServiceClass.FIRST,
};

export const DOMAIN_CABIN_CLASS_BY_TTBOOKING: Readonly<
  Record<TtbookingServiceClass, FlightCabinClass>
> = {
  [TtbookingServiceClass.ECONOMY]: FlightCabinClass.ECONOMY,
  [TtbookingServiceClass.PREMIUM]: FlightCabinClass.PREMIUM_ECONOMY,
  [TtbookingServiceClass.BUSINESS]: FlightCabinClass.BUSINESS,
  [TtbookingServiceClass.FIRST]: FlightCabinClass.FIRST,
};
