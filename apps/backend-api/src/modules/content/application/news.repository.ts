import type { NewsArticle } from '../domain/news-article';
import type { DateTimeValueObject } from '@shared/domain/value-objects';

export const NEWS_REPOSITORY = Symbol('NEWS_REPOSITORY');

export type NewsFeedItem = {
  article: NewsArticle;
  readAt: DateTimeValueObject | null;
};

export type NewsArticleWriteData = {
  title: string;
  summary: string;
  content: string;
  category: NewsArticle['category'];
  isPublished: boolean;
};

export type NewsArticleUpdateData = Partial<NewsArticleWriteData>;

export interface NewsRepository {
  createReader(): Promise<string>;
  readerExists(readerId: string): Promise<boolean>;
  listPublished(readerId: string): Promise<NewsFeedItem[]>;
  listAll(): Promise<NewsArticle[]>;
  create(data: NewsArticleWriteData): Promise<NewsArticle>;
  update(id: string, data: NewsArticleUpdateData): Promise<NewsArticle | null>;
  delete(id: string): Promise<boolean>;
  unreadCount(readerId: string): Promise<number>;
  markRead(
    readerId: string,
    newsId: string,
  ): Promise<DateTimeValueObject | null>;
}
