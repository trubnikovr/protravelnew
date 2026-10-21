import type { NewsArticle } from '@modules/content';
import type { AdminNewsArticleResponseDto } from './dto/admin-news.response.dto';

export class AdminNewsApiMapper {
  static toResponse(article: NewsArticle): AdminNewsArticleResponseDto {
    return {
      id: article.id.toString(),
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      isPublished: article.publishedAt !== null,
      publishedAt: article.publishedAt?.toISOString() ?? null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
  }
}
