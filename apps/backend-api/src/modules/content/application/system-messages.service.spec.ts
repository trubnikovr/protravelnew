import type { SystemMessagesRepository } from './system-messages.repository';
import { SystemMessagesService } from './system-messages.service';
import { SystemMessageType } from '../domain/system-message';

describe('SystemMessagesService', () => {
  const repository: jest.Mocked<SystemMessagesRepository> = {
    listActive: jest.fn(),
    listAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const service = new SystemMessagesService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('returns only repository-selected active messages to mobile clients', async () => {
    repository.listActive.mockResolvedValue([]);

    await expect(service.listActive()).resolves.toEqual([]);
    expect(repository.listActive.mock.calls).toHaveLength(1);
  });

  it('passes the supported semantic type to persistence', async () => {
    const input = {
      text: 'Некоторые функции временно недоступны.',
      type: SystemMessageType.ERROR,
      isActive: true,
    };
    repository.create.mockResolvedValue({} as never);

    await service.create(input);
    expect(repository.create.mock.calls[0]).toEqual([input]);
  });
});
