import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ToursStackParamList } from '../../../app/navigation/types';
import { PrimaryButton, ScreenHeader } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { transformedImageUrl } from '../../home/api/home.api';
import { useTour } from '../model/useTours';
import { tourLocation } from '../components/TourCard';
import { BookingAuthModal, useAuthSession } from '../../auth';

type DetailsRoute = RouteProp<
  { TourDetails: { tourId: string } },
  'TourDetails'
>;
const fallback = require('../../../shared/assets/images/hotel-otium.png');

export function TourDetailsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ToursStackParamList>>();
  const route = useRoute<DetailsRoute>();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [authVisible, setAuthVisible] = useState(false);
  const { session } = useAuthSession();
  const tour = useTour(route.params.tourId);

  if (tour.isPending) return <TourState loading onBack={navigation.goBack} />;
  if (tour.isError || !tour.data)
    return <TourState onBack={navigation.goBack} />;
  const data = tour.data;
  const images = [data.coverImage, ...data.galleryImages].filter(
    (image): image is { url: string } => Boolean(image?.url),
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={navigation.goBack} title={t('hotel.title')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          <ScrollView
            horizontal
            pagingEnabled
            onMomentumScrollEnd={({ nativeEvent }) => {
              setActiveImageIndex(
                Math.round(
                  nativeEvent.contentOffset.x /
                    nativeEvent.layoutMeasurement.width,
                ),
              );
            }}
            showsHorizontalScrollIndicator={false}
          >
            {(images.length ? images : [{ url: '' }]).map((image, index) => (
              <Image
                key={`${image.url}-${index}`}
                source={
                  image.url ? { uri: transformedImageUrl(image.url) } : fallback
                }
                style={[styles.hero, { width }]}
              />
            ))}
          </ScrollView>
          {images.length > 1 ? (
            <View style={styles.galleryDots}>
              {images.map((image, index) => (
                <View
                  key={`${image.url}-dot-${index}`}
                  style={[
                    styles.galleryDot,
                    index === activeImageIndex && styles.galleryDotActive,
                  ]}
                />
              ))}
            </View>
          ) : null}
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{data.content.title}</Text>
          <View style={styles.location}>
            <MapPin color={theme.colors.primary} size={18} />
            <Text style={styles.locationText}>{tourLocation(data)}</Text>
          </View>
          <Text style={styles.lead}>{data.content.shortDescription}</Text>
          <Text style={styles.description}>{data.content.description}</Text>
          <InfoSection title={t('tourDetails.summary')}>
            <InfoRow
              label={t('tourDetails.duration')}
              value={`${data.durationDays} дн. / ${data.durationNights} ноч.`}
            />
            <InfoRow
              label={t('hotel.price')}
              value={data.price?.formatted ?? ''}
            />
            {data.activeFrom && (
              <InfoRow
                label={t('tourDetails.activeFrom')}
                value={date(data.activeFrom)}
              />
            )}
            {data.activeTo && (
              <InfoRow
                label={t('tourDetails.activeTo')}
                value={date(data.activeTo)}
              />
            )}
          </InfoSection>
          {data.packageDetails && (
            <InfoSection title={t('tourDetails.accommodation')}>
              <InfoRow
                label={t('tourDetails.hotel')}
                value={`${data.packageDetails.hotelName}${
                  data.packageDetails.hotelCategory
                    ? ` ${'★'.repeat(data.packageDetails.hotelCategory)}`
                    : ''
                }`}
              />
              <InfoRow
                label={t('tourDetails.meal')}
                value={t(`tourDetails.meals.${data.packageDetails.mealType}`)}
              />
              <InfoRow
                label={t('tourDetails.transfer')}
                value={t(
                  data.packageDetails.transferIncluded
                    ? 'tourDetails.yes'
                    : 'tourDetails.no',
                )}
              />
              <InfoRow
                label={t('tourDetails.insurance')}
                value={t(
                  data.packageDetails.insuranceIncluded
                    ? 'tourDetails.yes'
                    : 'tourDetails.no',
                )}
              />
            </InfoSection>
          )}
          {data.excursionDetails && (
            <InfoSection title={t('tourDetails.excursion')}>
              <InfoRow
                label={t('tourDetails.guideLanguage')}
                value={data.excursionDetails.guideLanguage}
              />
              {data.excursionDetails.groupSizeMax && (
                <InfoRow
                  label={t('tourDetails.groupSize')}
                  value={String(data.excursionDetails.groupSizeMax)}
                />
              )}
            </InfoSection>
          )}
          <BulletSection
            items={data.content.inclusions}
            title={t('tourDetails.included')}
          />
          <BulletSection
            items={data.content.exclusions}
            title={t('tourDetails.excluded')}
          />
          {data.departures.length > 0 && (
            <InfoSection title={t('tourDetails.departures')}>
              {data.departures.map((departure, index) => (
                <InfoRow
                  key={`${departure.departureDate.toISOString()}-${index}`}
                  label={`${date(departure.departureDate)}${
                    departure.returnDate
                      ? ` — ${date(departure.returnDate)}`
                      : ''
                  }`}
                  value={[
                    departure.price?.formatted,
                    departure.seatsAvailable != null
                      ? t('tourDetails.seats', {
                          count: departure.seatsAvailable,
                        })
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                />
              ))}
            </InfoSection>
          )}
          {data.programDays.length > 0 && (
            <InfoSection title={t('tourDetails.program')}>
              {data.programDays.map(day => (
                <View key={day.dayNumber} style={styles.programDay}>
                  <Text style={styles.rowLabel}>
                    {t('tourDetails.day', { day: day.dayNumber })}: {day.title}
                  </Text>
                  <Text style={styles.rowValue}>{day.description}</Text>
                </View>
              ))}
            </InfoSection>
          )}
          <PrimaryButton
            onPress={() => {
              if (session)
                navigation.navigate('TourBooking', { tourId: data.id });
              else setAuthVisible(true);
            }}
            title={t('hotel.book')}
          />
        </View>
      </ScrollView>
      <BookingAuthModal
        onAuthenticated={() => {
          setAuthVisible(false);
          navigation.navigate('TourBooking', { tourId: data.id });
        }}
        onClose={() => setAuthVisible(false)}
        visible={authVisible}
      />
    </SafeAreaView>
  );
}

function TourState({
  loading,
  onBack,
}: {
  loading?: boolean;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={onBack} title={t('hotel.title')} />
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.state} />
      ) : (
        <Text style={styles.state}>{t('tourDetails.loadError')}</Text>
      )}
    </SafeAreaView>
  );
}

function InfoSection({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <InfoSection title={title}>
      {items.map(item => (
        <Text key={item} style={styles.bullet}>
          • {item}
        </Text>
      ))}
    </InfoSection>
  );
}

function date(value: Date): string {
  return value.toLocaleDateString('ru-RU');
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  gallery: { position: 'relative' },
  hero: { height: 280, resizeMode: 'cover' },
  galleryDots: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.radii.pill,
    bottom: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    position: 'absolute',
  },
  galleryDot: {
    backgroundColor: theme.colors.textMuted,
    borderRadius: theme.radii.pill,
    height: 6,
    width: 6,
  },
  galleryDotActive: {
    backgroundColor: theme.colors.white,
    width: 16,
  },
  body: {
    backgroundColor: theme.colors.surface,
    padding: theme.sizes.contentPadding,
  },
  title: { ...typography.title },
  location: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  locationText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  lead: { ...typography.bodySemibold, marginTop: theme.spacing.lg },
  description: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  section: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: { ...typography.titleSmall },
  row: { gap: theme.spacing.xxs },
  rowLabel: { ...typography.bodySemibold },
  rowValue: { ...typography.bodySmall, color: theme.colors.textSecondary },
  bullet: { ...typography.body, color: theme.colors.textSecondary },
  programDay: { gap: theme.spacing.xxs },
  state: {
    ...typography.body,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
