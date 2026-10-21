import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityIdValueObject } from '@shared/domain/value-objects';
import {
  NEWS_REPOSITORY,
  type NewsArticleUpdateData,
  type NewsArticleWriteData,
  type NewsRepository,
} from './news.repository';

@Injectable()
export class NewsService {
  constructor(
    @Inject(NEWS_REPOSITORY) private readonly repository: NewsRepository,
  ) {}

  async resolveReader(candidate?: string): Promise<string> {
    if (
      this.validReaderId(candidate) &&
      (await this.repository.readerExists(candidate))
    ) {
      return candidate;
    }
    return this.repository.createReader();
  }

  listPublished(readerId: string) {
    return this.repository.listPublished(readerId);
  }

  listAll() {
    return this.repository.listAll();
  }

  create(data: NewsArticleWriteData) {
    return this.repository.create(data);
  }

  update(id: string, data: NewsArticleUpdateData) {
    return this.repository.update(id, data);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  async unreadStatus(readerId: string) {
    const unreadCount = await this.repository.unreadCount(readerId);
    return { hasUnread: unreadCount > 0, unreadCount };
  }

  async markRead(readerId: string, newsId: string) {
    const readAt = await this.repository.markRead(readerId, newsId);
    if (readAt) return readAt;
    throw new NotFoundException({
      code: 'NEWS_NOT_FOUND',
      message: 'Published news article was not found',
    });
  }

  private validReaderId(candidate?: string): candidate is string {
    if (!candidate) return false;
    try {
      EntityIdValueObject.fromString(candidate);
      return true;
    } catch {
      return false;
    }
  }
}
