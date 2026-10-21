import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  PassengersScreen,
  SearchResultsScreen,
  SearchScreen,
} from '../../features/search';
import type {SearchStackParamList} from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={SearchScreen} name="SearchForm" />
      <Stack.Screen component={PassengersScreen} name="Passengers" />
      <Stack.Screen component={SearchResultsScreen} name="SearchResults" />
    </Stack.Navigator>
  );
}
