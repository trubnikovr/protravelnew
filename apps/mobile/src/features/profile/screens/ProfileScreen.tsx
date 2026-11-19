import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ChevronRight,
  CircleUserRound,
  LogOut,
  Plane,
  Ticket,
  UserRoundPen,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfileStackParamList } from '../../../app/navigation/types';
import { theme, typography } from '../../../shared/theme/theme';
import { useAuthSession } from '../../auth';
import { useCustomerProfile } from '../model/useCustomerProfile';

const menu = [
  { id: 'edit', titleKey: 'profile.edit', icon: UserRoundPen },
  { id: 'travelers', titleKey: 'profile.personal', icon: CircleUserRound },
  { id: 'flightBookings', titleKey: 'profile.flightBookings', icon: Plane },
  { id: 'tourBookings', titleKey: 'profile.tourBookings', icon: Ticket },
] as const;

type ProfileNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileOverview'
>;

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigation>();
  const { t } = useTranslation();
  const { phone, signOut } = useAuthSession();
  const profile = useCustomerProfile();

  const openMenuItem = (id: (typeof menu)[number]['id']) => {
    if (id === 'edit') {
      navigation.navigate('EditProfile');
    } else if (id === 'travelers') {
      navigation.navigate('Travelers');
    } else if (id === 'flightBookings') {
      navigation.navigate('FlightBookings');
    } else {
      navigation.navigate('Bookings');
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ImageBackground
        imageStyle={styles.backgroundImage}
        source={require('../../../shared/assets/images/profile-photo-background.png')}
        style={styles.background}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {profile.isPending ? (
          <ActivityIndicator
            color={theme.colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            <Text style={styles.phone}>{profile.data?.phone ?? phone}</Text>
            {profile.data?.email ? (
              <Text style={styles.phone}>{profile.data.email}</Text>
            ) : null}
          </>
        )}

        <View style={styles.menuCard}>
          {menu.map(({ id, titleKey, icon: Icon }, index) => (
            <Pressable
              key={id}
              onPress={() => openMenuItem(id)}
              style={[styles.row, index < menu.length - 1 && styles.rowBorder]}
            >
              <View style={styles.menuIcon}>
                <Icon color={theme.colors.primary} size={21} />
              </View>
              <Text style={styles.rowTitle}>{t(titleKey)}</Text>
              <ChevronRight color={theme.colors.textMuted} size={20} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={signOut} style={styles.logout}>
          <LogOut color={theme.colors.danger} size={21} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  backgroundImage: {
    resizeMode: 'cover',
    opacity: 0.72,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.sizes.contentPadding,
  },
  loader: {
    marginTop: theme.spacing.md,
  },
  phone: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  menuCard: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 64,
  },
  rowBorder: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.sm,
    height: 38,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 38,
  },
  rowTitle: {
    ...typography.bodySemibold,
    flex: 1,
  },
  logout: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.dangerSoft,
    borderRadius: theme.radii.md,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    minHeight: theme.sizes.buttonHeight,
  },
  logoutText: {
    ...typography.bodySemibold,
    color: theme.colors.danger,
    marginLeft: theme.spacing.xs,
  },
});
