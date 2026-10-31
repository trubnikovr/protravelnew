import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiArrayEnvelope,
  ApiEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { AdminPermission } from '@modules/admin';
import { SystemMessagesService } from '@modules/content';
import { SystemMessageApiMapper } from '@entrypoints/common/system-messages/system-message-api.mapper';
import { SystemMessageResponseDto } from '@entrypoints/common/system-messages/system-message.response.dto';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  CreateSystemMessageRequestDto,
  UpdateSystemMessageRequestDto,
} from './dto/system-message.request.dto';

@ApiTags('admin/system-messages')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/system-messages')
export class AdminSystemMessagesController {
  constructor(private readonly messages: SystemMessagesService) {}

  /** @see GET /api/v1/admin/system-messages */
  @Get()
  @RequirePermissions(AdminPermission.CONTENT_READ)
  @ApiOperation({ summary: 'List all mobile system messages' })
  @ApiArrayEnvelope(SystemMessageResponseDto)
  async list(): Promise<SystemMessageResponseDto[]> {
    const items = await this.messages.listAll();
    return items.map((item) => SystemMessageApiMapper.toResponse(item));
  }

  /** @see POST /api/v1/admin/system-messages */
  @Post()
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Create a mobile system message' })
  @ApiEnvelope(SystemMessageResponseDto, HttpStatus.CREATED)
  async create(
    @Body() dto: CreateSystemMessageRequestDto,
  ): Promise<SystemMessageResponseDto> {
    const message = await this.messages.create(dto);
    return SystemMessageApiMapper.toResponse(message);
  }

  /** @see PATCH /api/v1/admin/system-messages/:id */
  @Patch(':id')
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Update or activate a mobile system message' })
  @ApiOkEnvelope(SystemMessageResponseDto)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSystemMessageRequestDto,
  ): Promise<SystemMessageResponseDto> {
    const message = await this.messages.update(id, dto);
    if (!message) this.notFound();
    return SystemMessageApiMapper.toResponse(message);
  }

  /** @see DELETE /api/v1/admin/system-messages/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Delete a mobile system message' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    if (!(await this.messages.delete(id))) this.notFound();
  }

  private notFound(): never {
    throw new NotFoundException({
      code: 'SYSTEM_MESSAGE_NOT_FOUND',
      message: 'System message was not found',
    });
  }
}
