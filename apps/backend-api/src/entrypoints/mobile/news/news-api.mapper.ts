import type { NewsArticle } from '@modules/content';
import type { DateTimeValueObject } from '@shared/domain/value-objects';
import type { NewsArticleResponseDto } from './dto/response/news-article.response.dto';

export class NewsApiMapper {
  static toResponse(
    article: NewsArticle,
    readAt: DateTimeValueObject | null,
  ): NewsArticleResponseDto {
    if (!article.publishedAt) throw new Error('Published news has no date');
    return {
      id: article.id.toString(),
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      publishedAt: article.publishedAt.toISOString(),
      isRead: readAt !== null,
      readAt: readAt?.toISOString() ?? null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
  }
}
