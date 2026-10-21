import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../../features/home';
import { TourDetailsScreen } from '../../features/tours';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HomeScreen} name="HomeOverview" />
      <Stack.Screen component={TourDetailsScreen} name="TourDetails" />
    </Stack.Navigator>
  );
}
