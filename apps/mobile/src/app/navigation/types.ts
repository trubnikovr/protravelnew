import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  PhoneLogin: undefined;
  VerifyCode: {
    phone: string;
    verificationId: string;
    expiresIn: number;
    developmentCode?: string;
  };
};

export type HomeStackParamList = {
  HomeOverview: undefined;
  TourDetails: { tourId: string };
};

export type PassengerSelection = {
  adults: number;
  children: number;
  infants: number;
};

export type FlightPlaceSelection = {
  code: string;
  label: string;
  airportCodes: string[];
};

export type FlightSearchSelection = {
  departure: FlightPlaceSelection;
  destination: FlightPlaceSelection;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerSelection;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
};

export type AviaStackParamList = {
  AviaSearchForm: { passengers?: PassengerSelection } | undefined;
  AviaPassengers: {
    passengers: PassengerSelection;
  };
  AviaSearchResults: FlightSearchSelection;
  AviaDetails: { offerId: string; passengers: PassengerSelection };
  AviaBooking: { offerId: string; passengers: PassengerSelection; expiresAt?: string };
};

export type ToursStackParamList = {
  TourCatalog: undefined;
  TourDetails: { tourId: string };
  TourBooking: { tourId: string };
  AddBookingTraveler: { isCustomerDefault?: boolean } | undefined;
};

export type NewsStackParamList = {
  NewsFeed: undefined;
  NewsDetails: {
    id: string;
    title: string;
    content: string;
    category: 'promotion' | 'security' | 'general';
    publishedAt: Date;
  };
};

export type ProfileStackParamList = {
  ProfileOverview: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Travelers: undefined;
  AddTraveler: undefined;
  TravelerDetails: { travelerId: string };
  Bookings: undefined;
  FlightBookings: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  News: NavigatorScreenParams<NewsStackParamList> | undefined;
  Flights: NavigatorScreenParams<AviaStackParamList> | undefined;
  Tours: NavigatorScreenParams<ToursStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};
