import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NewsStackParamList } from '../../../app/navigation/types';
import { theme, typography } from '../../../shared/theme/theme';
import { ScreenHeader } from '../../../shared/ui';
import { formatNewsDate } from '../lib/formatNewsDate';

type Props = NativeStackScreenProps<NewsStackParamList, 'NewsDetails'>;

export function NewsDetailsScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const article = route.params;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScreenHeader
        title={t('news.detailsTitle')}
        onBack={navigation.goBack}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {t(`news.categories.${article.category}`)}
            </Text>
          </View>
          <Text style={styles.date}>{formatNewsDate(article.publishedAt)}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.body}>{article.content}</Text>
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
    paddingBottom: theme.spacing.xxxl,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    color: theme.colors.primary,
  },
  date: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  title: {
    ...typography.heading,
    marginTop: theme.spacing.lg,
  },
  body: {
    ...typography.bodyLarge,
    marginTop: theme.spacing.lg,
  },
});
