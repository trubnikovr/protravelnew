import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import type { DateTimeValueObject } from '@shared/domain/value-objects';

export type NewsCategory = 'promotion' | 'security' | 'general';

export interface NewsArticleProperties extends DomainEntityProperties {
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  publishedAt: DateTimeValueObject | null;
}

export class NewsArticle extends DomainEntity<NewsArticleProperties> {
  private constructor(private readonly properties: NewsArticleProperties) {
    super(properties);
  }

  static restore(properties: NewsArticleProperties): NewsArticle {
    if (
      !properties.title.trim() ||
      !properties.summary.trim() ||
      !properties.content.trim()
    ) {
      throw new Error('News title, summary and content are required');
    }
    return new NewsArticle(properties);
  }

  get title(): string {
    return this.properties.title;
  }

  get summary(): string {
    return this.properties.summary;
  }

  get content(): string {
    return this.properties.content;
  }

  get category(): NewsCategory {
    return this.properties.category;
  }

  get publishedAt(): DateTimeValueObject | null {
    return this.properties.publishedAt;
  }
}
