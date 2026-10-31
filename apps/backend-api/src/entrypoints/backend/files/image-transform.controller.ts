import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { RawResponse } from '@core/http/decorators/raw-response.decorator';
import { ImageTransformationService } from '@core/submodules/files';
import { TransformImageRequestDto } from './dto/request/transform-image.request.dto';

@ApiTags('files')
@Controller('files/image-transform')
export class ImageTransformController {
  constructor(private readonly images: ImageTransformationService) {}

  /** @see GET /api/v1/files/image-transform */
  @Get()
  @RawResponse()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Render a named uploaded-image preset and return cached WebP',
  })
  @ApiProduces('image/webp')
  @ApiOkResponse({
    content: { 'image/webp': { schema: { type: 'string', format: 'binary' } } },
  })
  @ApiNotFoundResponse({ description: 'Source image was not found' })
  async transform(
    @Query() query: TransformImageRequestDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const requestOrigin = `${request.protocol}://${request.get('host')}`;
    const image = await this.images.transform(query, requestOrigin);
    if (request.get('if-none-match') === image.etag) {
      response.status(304).end();
      return;
    }
    response.set({
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': image.contentType,
      'Cross-Origin-Resource-Policy': 'cross-origin',
      ETag: image.etag,
    });
    response.sendFile(image.path);
  }
}
