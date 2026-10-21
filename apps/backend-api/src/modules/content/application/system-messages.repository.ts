import type {
  SystemMessage,
  SystemMessageType,
} from '../domain/system-message';

export const SYSTEM_MESSAGES_REPOSITORY = Symbol('SYSTEM_MESSAGES_REPOSITORY');

export interface SystemMessageWriteData {
  text: string;
  type: SystemMessageType;
  isActive: boolean;
}

export type SystemMessageUpdateData = Partial<SystemMessageWriteData>;

export interface SystemMessagesRepository {
  listActive(): Promise<SystemMessage[]>;
  listAll(): Promise<SystemMessage[]>;
  create(data: SystemMessageWriteData): Promise<SystemMessage>;
  update(
    id: string,
    data: SystemMessageUpdateData,
  ): Promise<SystemMessage | null>;
  delete(id: string): Promise<boolean>;
}
