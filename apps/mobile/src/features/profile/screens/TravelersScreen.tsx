import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {Plus} from 'lucide-react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {ProfileStackParamList} from '../../../app/navigation/types';
import {ScreenHeader} from '../../../shared/ui';
import {theme, typography} from '../../../shared/theme/theme';
import {TravelerCard} from '../components/TravelerCard';
import {
  useCustomerTravelers,
  useDeleteCustomerTraveler,
} from '../model/useCustomerTravelers';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Travelers'>;

export function TravelersScreen({navigation}: Props) {
  const {t} = useTranslation();
  const travelers = useCustomerTravelers();
  const deleteTraveler = useDeleteCustomerTraveler();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScreenHeader
        onBack={navigation.goBack}
        title={t('profile.travelers')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {travelers.isPending ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : null}
        {travelers.isError ? (
          <Text style={styles.state}>{t('profile.travelersError')}</Text>
        ) : null}
        {travelers.data?.length === 0 ? (
          <Text style={styles.state}>{t('profile.travelersEmpty')}</Text>
        ) : null}
        {travelers.data?.map(traveler => (
          <TravelerCard
            key={traveler.id}
            onDelete={() => deleteTraveler.mutate(traveler.id)}
            traveler={traveler}
          />
        ))}
        <Pressable
          onPress={() => navigation.navigate('AddTraveler')}
          style={styles.addButton}>
          <Plus color={theme.colors.primary} size={20} />
          <Text style={styles.addText}>{t('profile.addTraveler')}</Text>
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
  content: {
    padding: theme.sizes.contentPadding,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: theme.sizes.buttonHeight,
  },
  addText: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  state: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
});
