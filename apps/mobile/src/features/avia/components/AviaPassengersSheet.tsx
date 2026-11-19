import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FilterChoice, PrimaryButton } from '../../../shared/ui';
import { theme } from '../../../shared/theme/theme';
import {
  cabinClassLabelKey,
  type CabinClass,
  type PassengerSelection,
} from '../model/aviaSearchForm';
import { aviaSearchFormStyles as styles } from './aviaSearchFormStyles';

export function AviaPassengersSheet({
  visible,
  passengers,
  cabinClass,
  onApply,
  onClose,
}: {
  visible: boolean;
  passengers: PassengerSelection;
  cabinClass: CabinClass;
  onApply: (passengers: PassengerSelection, cabinClass: CabinClass) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [draftPassengers, setDraftPassengers] = useState(passengers);
  const [draftCabinClass, setDraftCabinClass] = useState(cabinClass);
  useEffect(() => {
    if (!visible) return;
    setDraftPassengers(passengers);
    setDraftCabinClass(cabinClass);
  }, [cabinClass, passengers, visible]);
  const passengerRows: Array<{
    id: keyof PassengerSelection;
    label: string;
    hint: string;
  }> = [
    { id: 'adults', label: t('search.adults'), hint: t('search.adultsHint') },
    {
      id: 'children',
      label: t('search.children'),
      hint: t('search.childrenHint'),
    },
    {
      id: 'infants',
      label: t('search.infants'),
      hint: t('search.infantsHint'),
    },
  ];
  const updatePassenger = (id: keyof PassengerSelection, delta: number) => {
    setDraftPassengers(current => ({
      ...current,
      [id]: Math.max(id === 'adults' ? 1 : 0, current[id] + delta),
    }));
  };
  const classes = Object.keys(cabinClassLabelKey) as CabinClass[];
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalBackdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
          onPress={onClose}
          style={styles.backdropDismiss}
        />
        <View style={styles.passengersSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{t('search.passengersTitle')}</Text>
          {passengerRows.map(item => (
            <View key={item.id} style={styles.passengerRow}>
              <View style={styles.passengerText}>
                <Text style={styles.passengerLabel}>{item.label}</Text>
                <Text style={styles.passengerHint}>{item.hint}</Text>
              </View>
              <CounterButton
                disabled={
                  draftPassengers[item.id] <= (item.id === 'adults' ? 1 : 0)
                }
                onPress={() => updatePassenger(item.id, -1)}
                type="minus"
              />
              <Text style={styles.passengerCount}>
                {draftPassengers[item.id]}
              </Text>
              <CounterButton
                onPress={() => updatePassenger(item.id, 1)}
                primary
                type="plus"
              />
            </View>
          ))}
          <Text style={styles.classTitle}>{t('search.serviceClass')}</Text>
          <View style={styles.classOptions}>
            {classes.map(value => {
              const selected = value === draftCabinClass;
              return (
                <FilterChoice
                  key={value}
                  label={t(`common.${cabinClassLabelKey[value]}`)}
                  onPress={() => setDraftCabinClass(value)}
                  selected={selected}
                />
              );
            })}
          </View>
          <PrimaryButton
            onPress={() => onApply(draftPassengers, draftCabinClass)}
            title={t('common.apply')}
          />
        </View>
      </View>
    </Modal>
  );
}

function CounterButton({
  type,
  onPress,
  primary = false,
  disabled = false,
}: {
  type: 'minus' | 'plus';
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  const Icon = type === 'plus' ? Plus : Minus;
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.counterButton,
        primary && styles.counterButtonPrimary,
        disabled && styles.counterButtonDisabled,
      ]}
    >
      <Icon
        color={primary ? theme.colors.white : theme.colors.textSecondary}
        size={17}
      />
    </Pressable>
  );
}
