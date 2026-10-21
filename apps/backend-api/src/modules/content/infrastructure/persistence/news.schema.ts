import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { NewsCategory } from '../../domain/news-article';

export const newsArticles = pgTable(
  'news_articles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 180 }).notNull(),
    summary: text('summary').notNull(),
    content: text('content').notNull(),
    category: varchar('category', { length: 24 })
      .$type<NewsCategory>()
      .notNull()
      .default('general'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('news_articles_published_idx').on(table.publishedAt)],
);

export const newsReaders = pgTable('news_readers', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const newsReads = pgTable(
  'news_reads',
  {
    readerId: uuid('reader_id')
      .notNull()
      .references(() => newsReaders.id, { onDelete: 'cascade' }),
    newsId: uuid('news_id')
      .notNull()
      .references(() => newsArticles.id, { onDelete: 'cascade' }),
    readAt: timestamp('read_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.readerId, table.newsId] }),
    index('news_reads_reader_idx').on(table.readerId, table.readAt),
  ],
);

export type NewsArticleRecord = typeof newsArticles.$inferSelect;
