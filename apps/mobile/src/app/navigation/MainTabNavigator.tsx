import React from 'react';
import { View } from 'react-native';
import { ConnectionBanner } from '../../shared/ui/ConnectionBanner';
import { BottomTabBar, createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useNewsUnreadStatus } from '../../features/news';
import { theme, typography } from '../../shared/theme/theme';
import {
  NewsTabIcon,
  FlightsTabIcon,
  HomeTabIcon,
  ProfileTabIcon,
  ToursTabIcon,
} from '../../shared/ui';
import { HomeNavigator } from './HomeNavigator';
import { NewsNavigator } from './NewsNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { AviaNavigator } from './AviaNavigator';
import { ToursNavigator } from './ToursNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabBar(props: BottomTabBarProps) {
  return (
    <View>
      <ConnectionBanner />
      <BottomTabBar {...props} />
    </View>
  );
}

export function MainTabNavigator() {
  const { t } = useTranslation();
  const { hasUnread, unreadCount } = useNewsUnreadStatus();

  return (
    <Tab.Navigator
      tabBar={MainTabBar}
      screenOptions={{
        animation: 'shift',
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarLabelStyle: {
          ...typography.caption,
          marginTop: theme.spacing.xxs,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.sizes.tabBarHeight,
          paddingBottom: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
        },
      }}
    >
      <Tab.Screen
        component={HomeNavigator}
        name="Home"
        options={{
          tabBarIcon: HomeTabIcon,
          tabBarLabel: t('tabs.home'),
        }}
      />
      <Tab.Screen
        component={NewsNavigator}
        name="News"
        options={{
          tabBarBadge: hasUnread ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.colors.danger },
          tabBarIcon: NewsTabIcon,
          tabBarLabel: t('tabs.news'),
        }}
      />
      <Tab.Screen
        component={AviaNavigator}
        name="Flights"
        options={{
          tabBarIcon: FlightsTabIcon,
          tabBarLabel: t('tabs.flights'),
        }}
      />
      <Tab.Screen
        component={ToursNavigator}
        name="Tours"
        options={{
          tabBarIcon: ToursTabIcon,
          tabBarLabel: t('tabs.tours'),
        }}
      />
      <Tab.Screen
        component={ProfileNavigator}
        name="Profile"
        options={{
          tabBarIcon: ProfileTabIcon,
          tabBarLabel: t('tabs.profile'),
        }}
      />
    </Tab.Navigator>
  );
}
