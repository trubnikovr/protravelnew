import type { SystemMessage } from '@modules/content';
import type { SystemMessageResponseDto } from './system-message.response.dto';

export class SystemMessageApiMapper {
  static toResponse(message: SystemMessage): SystemMessageResponseDto {
    return {
      id: message.id.toString(),
      text: message.text,
      type: message.type,
      isActive: message.isActive,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    };
  }
}
