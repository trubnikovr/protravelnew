import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  CategoryCard,
  DestinationCard,
  RecommendedTourCard,
} from '../components/HomeCards';
import { SectionHeader, TravelStateIcon } from '../../../shared/ui';
import { categories } from '../data/home';
import { useHome } from '../model/useHome';
import { HomeSkeleton } from '../components/HomeSkeleton';
import type {
  HomeStackParamList,
  MainTabParamList,
} from '../../../app/navigation/types';
import { theme, typography } from '../../../shared/theme/theme';
import { useRefreshOnFocus } from '../../../shared/hooks/useRefreshOnFocus';
import { SystemMessagesBanner, useSystemMessages } from '../../system-messages';

type HomeNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeOverview'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { t } = useTranslation();
  const home = useHome();
  const systemMessages = useSystemMessages();
  const [refreshing, setRefreshing] = useState(false);
  useRefreshOnFocus(home.refresh);
  useRefreshOnFocus(systemMessages.refresh);

  const openFlights = () =>
    navigation.navigate('Flights', {
      screen: 'AviaSearchForm',
    });
  const openTours = () =>
    navigation.navigate('Tours', { screen: 'TourCatalog' });
  const refresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([home.refresh(), systemMessages.refresh()]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        alwaysBounceVertical
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            onRefresh={refresh}
            refreshing={refreshing}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryList}>
          {categories.map(item => (
            <CategoryCard
              key={item.id}
              image={item.image}
              onPress={() =>
                item.id === 'flights' ? openFlights() : openTours()
              }
              title={t(item.title)}
            />
          ))}
        </View>

        <SystemMessagesBanner messages={systemMessages.messages} />

        {home.loading ? (
          <HomeSkeleton />
        ) : home.error ? (
          <View style={styles.state}>
            <View style={styles.errorIcon}>
              <TravelStateIcon />
            </View>
            <Text style={styles.stateText}>{getApiErrorMessage(home.errorCause, t('home.loadError'))}</Text>
            <Pressable onPress={home.refresh} style={styles.retryButton}>
              <Text style={styles.retryText}>{t('common.retry')}</Text>
            </Pressable>
          </View>
        ) : home.recommended.length === 0 &&
          home.popularDestinations.length === 0 &&
          home.hotTours.length === 0 ? (
          <Text style={[styles.state, styles.stateText]}>
            {t('home.empty')}
          </Text>
        ) : (
          <>
            <View style={styles.section}>
              <SectionHeader title={t('home.recommended')} />
              <View style={styles.twoColumnList}>
                {home.recommended.map(hotel => (
                  <RecommendedTourCard
                    hotel={hotel}
                    key={hotel.id}
                    onPress={() =>
                      navigation.navigate('TourDetails', { tourId: hotel.id })
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionHeader title={t('home.destinations')} />
              <View style={styles.twoColumnList}>
                {home.popularDestinations.map(destination => (
                  <DestinationCard
                    destination={destination}
                    key={destination.id}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionHeader title={t('home.hotTours')} />
              <View style={styles.twoColumnList}>
                {home.hotTours.map(hotel => (
                  <RecommendedTourCard
                    hotel={hotel}
                    key={hotel.id}
                    onPress={() =>
                      navigation.navigate('TourDetails', { tourId: hotel.id })
                    }
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  categoryList: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.sizes.contentPadding,
    paddingBottom: 0,
    paddingTop: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.sizes.contentPadding,
    width: '100%',
  },
  twoColumnList: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  state: {
    marginHorizontal: theme.sizes.contentPadding,
    marginTop: theme.spacing.xxl,
  },
  stateText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorIcon: {
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    alignSelf: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  retryText: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
  },
});
