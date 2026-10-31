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

export type SearchStackParamList = {
  SearchForm: { passengers?: PassengerSelection } | undefined;
  Passengers: {
    passengers: PassengerSelection;
  };
  SearchResults: FlightSearchSelection;
  FlightDetails: { offerId: string; passengers: PassengerSelection };
  FlightBooking: { offerId: string; passengers: PassengerSelection };
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
  Bookings: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  News: NavigatorScreenParams<NewsStackParamList> | undefined;
  Flights: NavigatorScreenParams<SearchStackParamList> | undefined;
  Tours: NavigatorScreenParams<ToursStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};
