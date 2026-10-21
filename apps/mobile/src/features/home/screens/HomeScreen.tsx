import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Bell, Search, SlidersHorizontal } from 'lucide-react-native';
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
  HotelCard,
} from '../components/HomeCards';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { categories } from '../data/home';
import { useHome } from '../model/useHome';
import type {
  HomeStackParamList,
  MainTabParamList,
} from '../../../app/navigation/types';
import { theme, typography } from '../../../shared/theme/theme';
import { useRefreshOnFocus } from '../../../shared/hooks/useRefreshOnFocus';
import { SystemMessagesBanner, useSystemMessages } from '../../system-messages';
import { useAuthSession } from '../../auth';
import { useNewsUnreadStatus } from '../../news';
import { CustomerAvatar, useCustomerProfile } from '../../profile';

type HomeNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeOverview'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { t } = useTranslation();
  const home = useHome();
  const systemMessages = useSystemMessages();
  const { session, phone } = useAuthSession();
  const profile = useCustomerProfile(Boolean(session));
  const { hasUnread, unreadCount } = useNewsUnreadStatus();
  useRefreshOnFocus(home.refresh);
  useRefreshOnFocus(systemMessages.refresh);

  const openFlights = () =>
    navigation.navigate('Flights', {
      screen: 'SearchForm',
    });
  const openTours = () =>
    navigation.navigate('Tours', { screen: 'TourCatalog' });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel={t('profile.title')}
            accessibilityRole="button"
            onPress={() => navigation.navigate('Profile')}
          >
            <CustomerAvatar
              firstName={profile.data?.firstName}
              phone={profile.data?.phone ?? phone}
              size="compact"
            />
          </Pressable>
          <View style={styles.brand}>
            <Image
              source={require('../../../shared/assets/images/app-compass.png')}
              style={styles.brandIcon}
            />
            <Text style={styles.brandText}>{t('home.appName')}</Text>
          </View>
          <Pressable
            accessibilityLabel={
              hasUnread
                ? t('news.unreadCount', { count: unreadCount })
                : t('news.title')
            }
            accessibilityRole="button"
            onPress={() => navigation.navigate('News')}
            style={styles.notificationButton}
          >
            <Bell color={theme.colors.textStrong} size={23} />
            {hasUnread ? (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <SystemMessagesBanner messages={systemMessages.messages} />

        <View style={styles.searchRow}>
          <Pressable onPress={openTours} style={styles.searchBox}>
            <Search color={theme.colors.textSecondary} size={24} />
            <Text style={styles.searchPlaceholder}>{t('common.search')}</Text>
          </Pressable>
          <Pressable onPress={openTours} style={styles.filterButton}>
            <SlidersHorizontal color={theme.colors.white} size={25} />
          </Pressable>
        </View>

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

        {home.loading ? (
          <ActivityIndicator
            color={theme.colors.primary}
            style={styles.state}
          />
        ) : home.error ? (
          <View style={styles.state}>
            <Text style={styles.stateText}>{t('home.loadError')}</Text>
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
                  <HotelCard
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
                  <HotelCard
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.sizes.contentPadding,
    paddingVertical: theme.spacing.md,
  },
  brand: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  brandIcon: {
    height: 20,
    marginRight: theme.spacing.xs,
    width: 20,
  },
  brandText: {
    ...typography.titleSmall,
  },
  notificationButton: {
    ...theme.shadows.card,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  notificationBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    height: theme.spacing.lg,
    justifyContent: 'center',
    minWidth: theme.spacing.lg,
    position: 'absolute',
    right: theme.spacing.xxs,
    top: theme.spacing.xxs,
  },
  notificationBadgeText: {
    ...typography.caption,
    color: theme.colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.sizes.contentPadding,
    paddingVertical: theme.spacing.md,
  },
  searchBox: {
    ...theme.shadows.card,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    flex: 1,
    flexDirection: 'row',
    height: 58,
    paddingHorizontal: theme.spacing.md,
  },
  searchPlaceholder: {
    ...typography.bodyLarge,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  categoryList: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.sizes.contentPadding,
    paddingVertical: theme.spacing.md,
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
