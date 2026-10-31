import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiArrayEnvelope } from '@core/http/swagger/api-envelope.decorator';
import { SystemMessagesService } from '@modules/content';
import { SystemMessageApiMapper } from '@entrypoints/common/system-messages/system-message-api.mapper';
import { SystemMessageResponseDto } from '@entrypoints/common/system-messages/system-message.response.dto';

@ApiTags('system-messages')
@Controller('system-messages')
export class SystemMessagesController {
  constructor(private readonly messages: SystemMessagesService) {}

  /** @see GET /api/v1/system-messages */
  @Get()
  @ApiOperation({ summary: 'List active messages displayed by mobile clients' })
  @ApiArrayEnvelope(SystemMessageResponseDto)
  async list(): Promise<SystemMessageResponseDto[]> {
    const messages = await this.messages.listActive();
    return messages.map((message) =>
      SystemMessageApiMapper.toResponse(message),
    );
  }
}
