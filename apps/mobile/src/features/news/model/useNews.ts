import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNewsUnreadStatus,
  listNews,
  markNewsRead,
  type NewsArticle,
  type NewsUnreadStatus,
} from '../api/news.api';

type NewsState = {
  articles: NewsArticle[];
  loading: boolean;
  error: boolean;
  errorCause: unknown;
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (newsId: string) => Promise<void>;
};

export const newsQueryKey = ['news'] as const;
export const newsUnreadStatusQueryKey = ['news', 'unread-status'] as const;

export function useNewsUnreadStatus(): NewsUnreadStatus {
  const { data } = useQuery({
    queryKey: newsUnreadStatusQueryKey,
    queryFn: getNewsUnreadStatus,
    refetchInterval: 60 * 1000,
  });
  return data ?? { hasUnread: false, unreadCount: 0 };
}

export function useNews(): NewsState {
  const queryClient = useQueryClient();
  const { data, error, isError, isPending, isRefetching, refetch } = useQuery({
    queryKey: newsQueryKey,
    queryFn: listNews,
  });
  const { isError: mutationError, error: mutationErrorCause, mutateAsync } = useMutation({
    mutationFn: markNewsRead,
    onMutate: async newsId => {
      await queryClient.cancelQueries({ queryKey: newsQueryKey });
      const previous = queryClient.getQueryData<NewsArticle[]>(newsQueryKey);
      const previousStatus = queryClient.getQueryData<NewsUnreadStatus>(
        newsUnreadStatusQueryKey,
      );
      queryClient.setQueryData<NewsArticle[]>(newsQueryKey, current =>
        current?.map(article =>
          article.id === newsId ? { ...article, isRead: true } : article,
        ),
      );
      queryClient.setQueryData<NewsUnreadStatus>(
        newsUnreadStatusQueryKey,
        current => {
          if (!current) return current;
          const unreadCount = Math.max(0, current.unreadCount - 1);
          return { hasUnread: unreadCount > 0, unreadCount };
        },
      );
      return { previous, previousStatus };
    },
    onError: (_error, _newsId, context) => {
      queryClient.setQueryData(newsQueryKey, context?.previous);
      queryClient.setQueryData(
        newsUnreadStatusQueryKey,
        context?.previousStatus,
      );
    },
    onSuccess: result => {
      queryClient.setQueryData<NewsArticle[]>(newsQueryKey, current =>
        current?.map(article =>
          article.id === result.newsId
            ? { ...article, isRead: true, readAt: result.readAt }
            : article,
        ),
      );
    },
  });
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);
  const markRead = useCallback(
    async (newsId: string) => {
      try {
        await mutateAsync(newsId);
      } catch {
        // The mutation state exposes the error to the screen.
      }
    },
    [mutateAsync],
  );
  const articles = useMemo(() => data ?? [], [data]);

  return useMemo(
    () => ({
      articles,
      loading: isPending || isRefetching,
      error: isError || mutationError,
      errorCause: error ?? mutationErrorCause,
      unreadCount: articles.filter(article => !article.isRead).length,
      refresh,
      markRead,
    }),
    [
      articles,
      error,
      mutationErrorCause,
      isError,
      isPending,
      isRefetching,
      markRead,
      mutationError,
      refresh,
    ],
  );
}
