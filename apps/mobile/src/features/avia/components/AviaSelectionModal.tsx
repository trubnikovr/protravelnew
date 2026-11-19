import { getApiErrorMessage } from '../../../shared/api/api-errors';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../shared/theme/theme';
import { useAviaPlaceSuggestions } from '../model/useAviaSearch';
import {
  toLocalDate,
  isExcludedAviaPlace,
  placeOptionsLimit,
  type Selector,
  type Place,
} from '../model/aviaSearchForm';
import { AviaPopularPlaces } from './AviaPopularPlaces';
import { aviaSearchFormStyles as styles } from './aviaSearchFormStyles';

export function AviaSelectionModal({
  selector,
  excludedPlace,
  selectedDate,
  minimumDate,
  onSelectPlace,
  onSelectDate,
  onClose,
}: {
  selector: Selector | null;
  excludedPlace: Place | null;
  selectedDate: Date;
  minimumDate: Date;
  onSelectPlace: (place: Place) => void;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const isDate = selector === 'departureDate' || selector === 'returnDate';
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const suggestions = useAviaPlaceSuggestions(debouncedQuery);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);
  useEffect(() => {
    if (selector) {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [selector]);
  const normalizedQuery = debouncedQuery.trim();
  const places = normalizedQuery
    ? (suggestions.data ?? [])
        .filter(
          item =>
            item.airportCodes.length &&
            !isExcludedAviaPlace(item, excludedPlace),
        )
        .slice(0, placeOptionsLimit)
        .map(item => ({
          key: `${item.type}:${item.id}`,
          code: item.code ?? item.airportCodes[0],
          airportCodes: item.airportCodes,
          label: item.name,
          codesLabel: item.airportCodes.join(', '),
        }))
    : [];
  const title = isDate
    ? t('search.selectDate')
    : selector === 'departure'
    ? t('search.selectDeparture')
    : t('search.selectDestination');

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={selector !== null}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalKeyboardView}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}
            onPress={onClose}
            style={styles.backdropDismiss}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{title}</Text>
            {!isDate ? (
              <TextInput
                autoFocus
                onChangeText={setQuery}
                placeholder={t('search.placeSearchPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.searchInput}
                value={query}
              />
            ) : null}
            {isDate ? (
              <Calendar
                current={toLocalDate(selectedDate)}
                enableSwipeMonths
                firstDay={1}
                hideExtraDays
                key={`${selector}-${toLocalDate(selectedDate)}`}
                markedDates={{
                  [toLocalDate(selectedDate)]: {
                    selected: true,
                    selectedColor: theme.colors.primary,
                    selectedTextColor: theme.colors.white,
                  },
                }}
                minDate={toLocalDate(minimumDate)}
                onDayPress={day =>
                  onSelectDate(new Date(day.year, day.month - 1, day.day))
                }
                style={styles.calendar}
                theme={{
                  arrowColor: theme.colors.primary,
                  calendarBackground: theme.colors.surface,
                  dayTextColor: theme.colors.text,
                  monthTextColor: theme.colors.textStrong,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: theme.colors.white,
                  textDayFontFamily: theme.fonts.regular,
                  textDayFontSize: theme.fontSizes.body,
                  textDayHeaderFontFamily: theme.fonts.medium,
                  textDayHeaderFontSize: theme.fontSizes.caption,
                  textDisabledColor: theme.colors.textMuted,
                  textMonthFontFamily: theme.fonts.semibold,
                  textMonthFontSize: theme.fontSizes.bodyLarge,
                  todayTextColor: theme.colors.primary,
                }}
              />
            ) : null}
            {!isDate && !query.trim() ? (
              <AviaPopularPlaces
                excludedPlace={excludedPlace}
                onSelectPlace={onSelectPlace}
              />
            ) : null}
            {!isDate && query.trim() ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.placeResults}
              >
                {normalizedQuery && suggestions.isFetching && !places.length ? (
                  <ActivityIndicator
                    color={theme.colors.primary}
                    style={styles.modalState}
                  />
                ) : null}
                {suggestions.isError && !places.length ? (
                  <Text style={styles.modalStateText}>
                    {getApiErrorMessage(suggestions.error, t('search.placeSearchError'))}
                  </Text>
                ) : null}
                {normalizedQuery &&
                !suggestions.isFetching &&
                !suggestions.isError &&
                places.length === 0 ? (
                  <Text style={styles.modalStateText}>
                    {t('search.placeSearchEmpty')}
                  </Text>
                ) : null}
                {places.map(option => (
                  <Pressable
                    key={option.key}
                    onPress={() =>
                      onSelectPlace({
                        code: option.code,
                        label: option.label,
                        airportCodes: option.airportCodes,
                      })
                    }
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>{option.label}</Text>
                    <Text style={styles.modalOptionCode}>
                      {option.codesLabel}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
            <Pressable onPress={onClose} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
