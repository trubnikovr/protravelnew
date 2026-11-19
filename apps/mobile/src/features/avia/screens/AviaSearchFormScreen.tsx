import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSelectField, PrimaryButton } from '../../../shared/ui';
import { AviaPassengersSheet } from '../components/AviaPassengersSheet';
import { AviaSelectionModal } from '../components/AviaSelectionModal';
import { aviaSearchFormStyles as styles } from '../components/aviaSearchFormStyles';
import { cabinClassLabelKey, formatDate } from '../model/aviaSearchForm';
import { useAviaSearchForm } from '../model/useAviaSearchForm';

export function AviaSearchFormScreen() {
  const { t } = useTranslation();
  const form = useAviaSearchForm();
  const {
    departure,
    destination,
    departureDate,
    returnDate,
    selector,
    passengers,
    cabinClass,
    passengersVisible,
    passengerCount,
  } = form;

  //console.log({ selector });
  return (
    <>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View pointerEvents="none" style={styles.background}>
          <ImageBackground
            imageStyle={styles.backgroundImage}
            source={require('../../../shared/assets/images/flight-search.png')}
            style={styles.background}
          />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formTopSpacer} />
          <View style={styles.formCard}>
            <View style={styles.routeFields}>
              <AppSelectField
                code={departure?.code ?? ''}
                label={t('search.from')}
                onPress={form.openDeparture}
                value={departure?.label ?? ''}
              />
              <AppSelectField
                code={destination?.code ?? ''}
                label={t('search.to')}
                onPress={form.openDestination}
                value={destination?.label ?? ''}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('search.swapRoute')}
                disabled={!departure || !destination}
                onPress={form.swapRoute}
                style={styles.swapButton}
              >
                <Image
                  source={require('../../../shared/assets/images/swap-directions.png')}
                  style={styles.swapIcon}
                />
              </Pressable>
            </View>

            <View style={styles.dateRow}>
              <AppSelectField
                compact
                label={t('search.departureDate')}
                onClear={form.clearDepartureDate}
                onPress={form.openDepartureDate}
                rightDivider
                showClear={departureDate !== null}
                value={departureDate ? formatDate(departureDate) : ''}
              />
              <AppSelectField
                compact
                label={t('search.returnDate')}
                onClear={form.clearReturnDate}
                onPress={form.openReturnDate}
                showClear={returnDate !== null}
                value={returnDate ? formatDate(returnDate) : ''}
              />
            </View>

            <AppSelectField
              label={t(`common.${cabinClassLabelKey[cabinClass]}`)}
              onPress={form.openPassengers}
              showChevron
              value={t('search.passengerCount', { count: passengerCount })}
            />
          </View>

          <View style={styles.submitButton}>
            <PrimaryButton
              disabled={!departure || !destination || !departureDate}
              onPress={form.submit}
              title={t('search.findFlights')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      {selector !== null ? (
        <AviaSelectionModal
          excludedPlace={selector === 'departure' ? destination : departure}
          minimumDate={form.minimumDate}
          onClose={form.closeSelector}
          onSelectDate={form.selectDate}
          onSelectPlace={form.selectPlace}
          selectedDate={form.selectedDate}
          selector={selector}
        />
      ) : null}
      {passengersVisible ? (
        <AviaPassengersSheet
          cabinClass={cabinClass}
          onApply={form.applyPassengers}
          onClose={form.closePassengers}
          passengers={passengers}
          visible={passengersVisible}
        />
      ) : null}
    </>
  );
}
