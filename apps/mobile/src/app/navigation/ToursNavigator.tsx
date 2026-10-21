import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TourDetailsScreen, ToursScreen } from '../../features/tours';
import { TourBookingScreen } from '../../features/bookings';
import { AddTravelerScreen } from '../../features/profile';
import type { ToursStackParamList } from './types';

const Stack = createNativeStackNavigator<ToursStackParamList>();

export function ToursNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={ToursScreen} name="TourCatalog" />
      <Stack.Screen component={TourDetailsScreen} name="TourDetails" />
      <Stack.Screen component={TourBookingScreen} name="TourBooking" />
      <Stack.Screen component={AddTravelerScreen} name="AddBookingTraveler" />
    </Stack.Navigator>
  );
}
