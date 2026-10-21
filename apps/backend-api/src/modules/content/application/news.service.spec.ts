import { NotFoundException } from '@nestjs/common';
import { NewsService } from './news.service';
import type { NewsRepository } from './news.repository';
import { DateTimeValueObject } from '@shared/domain/value-objects';

describe('NewsService', () => {
  const readerId = '8a99b78b-a85d-4a7c-9438-b79cc2afca46';
  const repository: jest.Mocked<NewsRepository> = {
    createReader: jest.fn(),
    readerExists: jest.fn(),
    listPublished: jest.fn(),
    listAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    unreadCount: jest.fn(),
    markRead: jest.fn(),
  };
  const service = new NewsService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('reuses a known reader', async () => {
    repository.readerExists.mockResolvedValue(true);

    await expect(service.resolveReader(readerId)).resolves.toBe(readerId);
    expect(repository.createReader.mock.calls).toHaveLength(0);
  });

  it('creates a reader when no valid cookie exists', async () => {
    repository.createReader.mockResolvedValue('new-reader-id');

    await expect(service.resolveReader()).resolves.toBe('new-reader-id');
  });

  it('does not query PostgreSQL with a malformed reader cookie', async () => {
    repository.createReader.mockResolvedValue('new-reader-id');

    await expect(service.resolveReader('not-a-uuid')).resolves.toBe(
      'new-reader-id',
    );
    expect(repository.readerExists.mock.calls).toHaveLength(0);
  });

  it('returns the server read timestamp', async () => {
    const readAt = DateTimeValueObject.now();
    repository.markRead.mockResolvedValue(readAt);

    await expect(service.markRead('reader-id', 'news-id')).resolves.toBe(
      readAt,
    );
  });

  it('reports whether the reader has unread news', async () => {
    repository.unreadCount.mockResolvedValue(2);

    await expect(service.unreadStatus(readerId)).resolves.toEqual({
      hasUnread: true,
      unreadCount: 2,
    });
  });

  it('reports an empty unread state', async () => {
    repository.unreadCount.mockResolvedValue(0);

    await expect(service.unreadStatus(readerId)).resolves.toEqual({
      hasUnread: false,
      unreadCount: 0,
    });
  });

  it('rejects an unknown article', async () => {
    repository.markRead.mockResolvedValue(null);

    await expect(
      service.markRead('reader-id', 'news-id'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
