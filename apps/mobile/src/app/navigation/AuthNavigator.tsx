import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PhoneLoginScreen, VerifyCodeScreen} from '../../features/auth';
import type {AuthStackParamList} from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={PhoneLoginScreen} name="PhoneLogin" />
      <Stack.Screen component={VerifyCodeScreen} name="VerifyCode" />
    </Stack.Navigator>
  );
}
