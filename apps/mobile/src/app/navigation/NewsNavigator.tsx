import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewsDetailsScreen, NewsScreen } from '../../features/news';
import type { NewsStackParamList } from './types';

const Stack = createNativeStackNavigator<NewsStackParamList>();

export function NewsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={NewsScreen} name="NewsFeed" />
      <Stack.Screen component={NewsDetailsScreen} name="NewsDetails" />
    </Stack.Navigator>
  );
}
