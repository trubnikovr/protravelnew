import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabNavigator} from './MainTabNavigator';
import type {RootStackParamList} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen component={MainTabNavigator} name="Main" />
    </RootStack.Navigator>
  );
}
