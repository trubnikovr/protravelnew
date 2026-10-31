import React from 'react';
import {
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Plane, ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NewsStackParamList } from '../../../app/navigation/types';
import { ScreenHeader, TravelStateCard } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';
import { useNews } from '../model/useNews';
import type { NewsArticle, NewsCategory } from '../api/news.api';
import { useRefreshOnFocus } from '../../../shared/hooks/useRefreshOnFocus';
import { formatNewsDate } from '../lib/formatNewsDate';

type Props = NativeStackScreenProps<NewsStackParamList, 'NewsFeed'>;

export function NewsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { articles, error, loading, markRead, refresh } = useNews();
  useRefreshOnFocus(refresh);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ImageBackground
        imageStyle={styles.backgroundImage}
        source={require('../../../shared/assets/images/news-background.png')}
        style={styles.background}
      />
      <ScreenHeader title={t('news.title')} />
      <ScrollView
        contentContainerStyle={[styles.content, error && !articles.length ? styles.errorContent : undefined]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <TravelStateCard
            title={t('news.loadError')}
            message={t('common.connectionUnavailable')}
            actionLabel={t('common.retry')}
            onAction={refresh}
          />
        ) : null}
        {!loading && !error && articles.length === 0 ? (
          <Text style={styles.stateText}>{t('news.empty')}</Text>
        ) : null}
        {articles.map(article => (
          <NotificationCard
            article={article}
            key={article.id}
            onPress={() => {
              if (!article.isRead) markRead(article.id);
              navigation.navigate('NewsDetails', {
                id: article.id,
                title: article.title,
                content: article.content,
                category: article.category,
                publishedAt: article.publishedAt,
              });
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationCard({
  article,
  onPress,
}: {
  article: NewsArticle;
  onPress: () => void;
}) {
  const icon = newsIcon(article.category);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.icon}>{icon}</View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{article.title}</Text>
          <View
            style={[
              styles.readStateDot,
              article.isRead ? styles.readDot : styles.unreadDot,
            ]}
          />
        </View>
        <Text style={styles.cardText}>{article.summary}</Text>
        <Text style={styles.time}>{formatNewsDate(article.publishedAt)}</Text>
      </View>
    </Pressable>
  );
}

function newsIcon(category: NewsCategory): React.ReactNode {
  return category === 'security' ? (
    <ShieldCheck color={theme.colors.success} size={23} />
  ) : (
    <Plane color={theme.colors.primary} size={23} />
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
  },
  content: {
    padding: theme.sizes.contentPadding,
  },
  card: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 44,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 44,
  },
  cardBody: {
    flex: 1,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    ...typography.bodySemibold,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  cardText: {
    ...typography.bodySmall,
    marginTop: theme.spacing.xs,
  },
  readStateDot: {
    borderRadius: theme.radii.pill,
    height: 8,
    marginLeft: theme.spacing.xs,
    marginTop: theme.spacing.xxs,
    width: 8,
  },
  readDot: {
    backgroundColor: theme.colors.tabInactive,
  },
  unreadDot: {
    backgroundColor: theme.colors.primary,
  },
  errorContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  stateText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
