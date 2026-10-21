import {
  Controller,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiEnvelope } from '@core/http/swagger/api-envelope.decorator';
import { ImageResponseDto } from '@entrypoints/common/dto/response/image.response.dto';
import { AdminPermission } from '@modules/admin';
import { LocalImageStorageService } from '@core/submodules/files';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@ApiTags('admin/files')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/files')
export class AdminFilesController {
  constructor(
    private readonly images: LocalImageStorageService,
    private readonly config: ConfigService,
  ) {}

  @Post('images')
  @RequirePermissions(AdminPermission.TOURS_WRITE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload an image for administrative content' })
  @ApiEnvelope(ImageResponseDto, 201)
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<ImageResponseDto> {
    const image = await this.images.store(file);
    const requestOrigin = `${request.protocol}://${request.get('host')}`;
    const publicOrigin =
      this.config.get<string>('PUBLIC_API_URL')?.replace(/\/$/, '') ||
      requestOrigin;
    return { url: `${publicOrigin}/api/v1/files/images/${image.filename}` };
  }
}
