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
import { NewsService } from '@modules/content';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AdminNewsApiMapper } from './admin-news-api.mapper';
import {
  CreateAdminNewsRequestDto,
  UpdateAdminNewsRequestDto,
} from './dto/admin-news.request.dto';
import { AdminNewsArticleResponseDto } from './dto/admin-news.response.dto';

@ApiTags('admin/news')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/news')
export class AdminNewsController {
  constructor(private readonly news: NewsService) {}

  @Get()
  @RequirePermissions(AdminPermission.CONTENT_READ)
  @ApiOperation({ summary: 'List all news articles' })
  @ApiArrayEnvelope(AdminNewsArticleResponseDto)
  async list(): Promise<AdminNewsArticleResponseDto[]> {
    return (await this.news.listAll()).map((article) =>
      AdminNewsApiMapper.toResponse(article),
    );
  }

  @Post()
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Create a news article' })
  @ApiEnvelope(AdminNewsArticleResponseDto, HttpStatus.CREATED)
  async create(
    @Body() dto: CreateAdminNewsRequestDto,
  ): Promise<AdminNewsArticleResponseDto> {
    return AdminNewsApiMapper.toResponse(await this.news.create(dto));
  }

  @Patch(':id')
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Update or publish a news article' })
  @ApiOkEnvelope(AdminNewsArticleResponseDto)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminNewsRequestDto,
  ): Promise<AdminNewsArticleResponseDto> {
    const article = await this.news.update(id, dto);
    if (!article) this.notFound();
    return AdminNewsApiMapper.toResponse(article);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Delete a news article' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    if (!(await this.news.delete(id))) this.notFound();
  }

  private notFound(): never {
    throw new NotFoundException({
      code: 'NEWS_NOT_FOUND',
      message: 'News article was not found',
    });
  }
}
