import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AviaDetailsScreen,
  AviaBookingScreen,
  AviaPassengersScreen,
  AviaSearchResultsScreen,
  AviaSearchFormScreen,
} from '../../features/avia';
import type { AviaStackParamList } from './types';

const Stack = createNativeStackNavigator<AviaStackParamList>();

export function AviaNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={AviaSearchFormScreen} name="AviaSearchForm" />
      <Stack.Screen component={AviaPassengersScreen} name="AviaPassengers" />
      <Stack.Screen component={AviaSearchResultsScreen} name="AviaSearchResults" />
      <Stack.Screen component={AviaDetailsScreen} name="AviaDetails" />
      <Stack.Screen component={AviaBookingScreen} name="AviaBooking" />
    </Stack.Navigator>
  );
}
