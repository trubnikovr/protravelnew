export interface CustomerForTourBookingContract {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
}

export interface TravelerForTourBookingContract {
  travelerId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: 'male' | 'female' | 'unspecified';
  birthDate: string | null;
  citizenshipCountryCode: string | null;
}
