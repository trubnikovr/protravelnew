import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, isNotNull, isNull, sql } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import {
  DateTimeValueObject,
  EntityIdValueObject,
} from '@shared/domain/value-objects';
import type {
  NewsFeedItem,
  NewsArticleUpdateData,
  NewsArticleWriteData,
  NewsRepository,
} from '../../application/news.repository';
import { NewsArticle } from '../../domain/news-article';
import {
  newsArticles,
  newsReaders,
  newsReads,
  type NewsArticleRecord,
} from './news.schema';

@Injectable()
export class DrizzleNewsRepository implements NewsRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async createReader(): Promise<string> {
    const [reader] = await this.database
      .insert(newsReaders)
      .values({})
      .returning({ id: newsReaders.id });
    return reader.id;
  }

  async readerExists(readerId: string): Promise<boolean> {
    const records = await this.database
      .select({ id: newsReaders.id })
      .from(newsReaders)
      .where(eq(newsReaders.id, readerId))
      .limit(1);
    return records.length > 0;
  }

  async listPublished(readerId: string): Promise<NewsFeedItem[]> {
    const records = await this.database
      .select({ article: newsArticles, readAt: newsReads.readAt })
      .from(newsArticles)
      .leftJoin(
        newsReads,
        and(
          eq(newsReads.newsId, newsArticles.id),
          eq(newsReads.readerId, readerId),
        ),
      )
      .where(isNotNull(newsArticles.publishedAt))
      .orderBy(desc(newsArticles.publishedAt), desc(newsArticles.id));
    return records.map(({ article, readAt }) => ({
      article: this.toDomain(article),
      readAt: readAt ? DateTimeValueObject.fromDate(readAt) : null,
    }));
  }

  async listAll(): Promise<NewsArticle[]> {
    const records = await this.database
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.updatedAt), desc(newsArticles.id));
    return records.map((record) => this.toDomain(record));
  }

  async create(data: NewsArticleWriteData): Promise<NewsArticle> {
    const [record] = await this.database
      .insert(newsArticles)
      .values({
        title: data.title.trim(),
        summary: data.summary.trim(),
        content: data.content.trim(),
        category: data.category,
        publishedAt: data.isPublished ? new Date() : null,
      })
      .returning();
    return this.toDomain(record);
  }

  async update(id: string, data: NewsArticleUpdateData) {
    const { isPublished, ...content } = data;
    const [record] = await this.database
      .update(newsArticles)
      .set({
        ...content,
        ...(content.title ? { title: content.title.trim() } : {}),
        ...(content.summary ? { summary: content.summary.trim() } : {}),
        ...(content.content ? { content: content.content.trim() } : {}),
        ...(isPublished === undefined
          ? {}
          : {
              publishedAt: isPublished
                ? sql`coalesce(${newsArticles.publishedAt}, now())`
                : null,
            }),
        updatedAt: new Date(),
      })
      .where(eq(newsArticles.id, id))
      .returning();
    return record ? this.toDomain(record) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.database
      .delete(newsArticles)
      .where(eq(newsArticles.id, id))
      .returning({ id: newsArticles.id });
    return deleted.length > 0;
  }

  async unreadCount(readerId: string): Promise<number> {
    const [result] = await this.database
      .select({ value: count() })
      .from(newsArticles)
      .leftJoin(
        newsReads,
        and(
          eq(newsReads.newsId, newsArticles.id),
          eq(newsReads.readerId, readerId),
        ),
      )
      .where(
        and(isNotNull(newsArticles.publishedAt), isNull(newsReads.newsId)),
      );
    return result.value;
  }

  async markRead(readerId: string, newsId: string) {
    const [article] = await this.database
      .select({ id: newsArticles.id })
      .from(newsArticles)
      .where(
        and(eq(newsArticles.id, newsId), isNotNull(newsArticles.publishedAt)),
      )
      .limit(1);
    if (!article) return null;
    const [read] = await this.database
      .insert(newsReads)
      .values({ readerId, newsId })
      .onConflictDoUpdate({
        target: [newsReads.readerId, newsReads.newsId],
        set: { readAt: new Date() },
      })
      .returning({ readAt: newsReads.readAt });
    return DateTimeValueObject.fromDate(read.readAt);
  }

  private toDomain(record: NewsArticleRecord): NewsArticle {
    return NewsArticle.restore({
      id: EntityIdValueObject.fromString(record.id),
      title: record.title,
      summary: record.summary,
      content: record.content,
      category: record.category,
      publishedAt: record.publishedAt
        ? DateTimeValueObject.fromDate(record.publishedAt)
        : null,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    });
  }
}
