import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../shared/theme/theme';
import {
  isExcludedAviaPlace,
  placeOptionsLimit,
  type Place,
} from '../model/aviaSearchForm';
import { useAviaPopularPlaces } from '../model/useAviaPopularPlaces';
import { aviaSearchFormStyles as styles } from './aviaSearchFormStyles';

export function AviaPopularPlaces({
  onSelectPlace,
  excludedPlace,
}: {
  excludedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
}) {
  const { t } = useTranslation();
  const { places, selection } = useAviaPopularPlaces();
  const visiblePlaces = (places.data ?? [])
    .filter(place => !isExcludedAviaPlace(place, excludedPlace))
    .slice(0, placeOptionsLimit);
  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.placeResults}>
      {places.isPending ? (
        <ActivityIndicator
          color={theme.colors.primary}
          style={styles.modalState}
        />
      ) : null}
      {places.isError ? (
        <View>
          <Text style={styles.modalStateText}>
            {getApiErrorMessage(places.error, t('search.placeSearchError'))}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              places.refetch();
            }}
            style={styles.modalCancel}
          >
            <Text style={styles.modalCancelText}>{t('common.retry')}</Text>
          </Pressable>
        </View>
      ) : null}
      {places.isSuccess && !visiblePlaces.length ? (
        <Text style={styles.modalStateText}>
          {t('search.placeSearchEmpty')}
        </Text>
      ) : null}
      {selection.isError ? (
        <Text style={styles.modalStateText}>
          {getApiErrorMessage(selection.error, t('search.placeSearchError'))}
        </Text>
      ) : null}
      {visiblePlaces.map(place => (
        <Pressable
          key={place.cityId}
          accessibilityRole="button"
          disabled={selection.isPending}
          onPress={() => selection.mutate(place, { onSuccess: onSelectPlace })}
          style={styles.modalOption}
        >
          <View style={styles.passengerText}>
            <Text style={styles.passengerLabel}>{place.name}</Text>
          </View>
          {selection.isPending && selection.variables.cityId === place.cityId ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}
