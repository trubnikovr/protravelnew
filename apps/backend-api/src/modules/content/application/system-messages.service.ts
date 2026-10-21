import { Inject, Injectable } from '@nestjs/common';
import {
  SYSTEM_MESSAGES_REPOSITORY,
  type SystemMessagesRepository,
  type SystemMessageUpdateData,
  type SystemMessageWriteData,
} from './system-messages.repository';

@Injectable()
export class SystemMessagesService {
  constructor(
    @Inject(SYSTEM_MESSAGES_REPOSITORY)
    private readonly repository: SystemMessagesRepository,
  ) {}

  listActive() {
    return this.repository.listActive();
  }

  listAll() {
    return this.repository.listAll();
  }

  create(data: SystemMessageWriteData) {
    return this.repository.create(data);
  }

  update(id: string, data: SystemMessageUpdateData) {
    return this.repository.update(id, data);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
