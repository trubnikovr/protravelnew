import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AddTravelerScreen,
  EditProfileScreen,
  ProfileScreen,
  SettingsScreen,
  TravelersScreen,
  TravelerDetailsScreen,
  FlightBookingsScreen,
} from '../../features/profile';
import { useAuthSession } from '../../features/auth';
import { BookingsScreen } from '../../features/bookings';
import { AuthNavigator } from './AuthNavigator';
import type { ProfileStackParamList } from './types';
import { theme } from '../../shared/theme/theme';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
  const { restoring, session } = useAuthSession();

  if (restoring) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={ProfileScreen} name="ProfileOverview" />
      <Stack.Screen component={EditProfileScreen} name="EditProfile" />
      <Stack.Screen component={SettingsScreen} name="Settings" />
      <Stack.Screen component={TravelersScreen} name="Travelers" />
      <Stack.Screen component={AddTravelerScreen} name="AddTraveler" />
      <Stack.Screen component={TravelerDetailsScreen} name="TravelerDetails" />
      <Stack.Screen component={BookingsScreen} name="Bookings" />
      <Stack.Screen component={FlightBookingsScreen} name="FlightBookings" />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
