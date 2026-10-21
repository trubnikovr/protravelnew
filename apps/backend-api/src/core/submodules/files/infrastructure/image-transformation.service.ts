import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, rename, stat, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import {
  type ImageTransformInput,
  ImageFit,
  ImagePreset,
  type TransformedImage,
} from '../application/image-transform.types';

const IMAGE_FILENAME = /^[a-f0-9-]+\.(jpg|png|webp)$/;
const WEBP_QUALITY = 82;
const IMAGE_PRESETS = {
  [ImagePreset.HOME_CARD]: {
    width: 600,
    height: 420,
    fit: ImageFit.COVER,
  },
} as const;

@Injectable()
export class ImageTransformationService {
  private readonly sourceDirectory: string;
  private readonly cacheDirectory: string;
  private readonly publicOrigin: string | null;
  private readonly sourcePathPrefix: string;

  constructor(config: ConfigService) {
    const uploads = resolve(config.getOrThrow<string>('UPLOAD_DIRECTORY'));
    this.sourceDirectory = resolve(uploads, 'images');
    this.cacheDirectory = resolve(uploads, 'image-transforms');
    const publicUrl = config.get<string>('PUBLIC_API_URL');
    this.publicOrigin = publicUrl ? new URL(publicUrl).origin : null;
    const apiPrefix = config
      .getOrThrow<string>('API_PREFIX')
      .replace(/^\/+|\/+$/g, '');
    this.sourcePathPrefix = `/${apiPrefix}/v1/files/images/`;
  }

  async transform(
    input: ImageTransformInput,
    requestOrigin: string,
  ): Promise<TransformedImage> {
    const filename = this.resolveFilename(input.src, requestOrigin);
    const variant = IMAGE_PRESETS[input.preset];
    const cacheKey = this.cacheKey(filename, input.preset, variant);
    const cachePath = resolve(this.cacheDirectory, `${cacheKey}.webp`);
    if (await this.cacheExists(cachePath)) {
      return this.result(cachePath, cacheKey);
    }
    return this.generate(filename, cachePath, cacheKey, variant);
  }

  private resolveFilename(src: string, requestOrigin: string): string {
    let url: URL;
    try {
      url = new URL(src, requestOrigin);
    } catch {
      throw this.invalidSource();
    }
    const allowedOrigins = [requestOrigin, this.publicOrigin].filter(Boolean);
    if (!allowedOrigins.includes(url.origin)) throw this.invalidSource();
    if (!url.pathname.startsWith(this.sourcePathPrefix)) {
      throw this.invalidSource();
    }
    const filename = url.pathname.slice(this.sourcePathPrefix.length);
    if (!IMAGE_FILENAME.test(filename)) throw this.invalidSource();
    return filename;
  }

  private async generate(
    filename: string,
    cachePath: string,
    cacheKey: string,
    variant: (typeof IMAGE_PRESETS)[ImagePreset],
  ): Promise<TransformedImage> {
    const sourcePath = resolve(this.sourceDirectory, filename);
    try {
      await stat(sourcePath);
      await mkdir(this.cacheDirectory, { recursive: true });
      const temporaryPath = `${cachePath}.${randomUUID()}.tmp`;
      await sharp(sourcePath, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize(variant.width, variant.height, {
          fit: variant.fit,
          position: 'centre',
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(temporaryPath);
      await this.publishCacheFile(temporaryPath, cachePath);
      return this.result(cachePath, cacheKey);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException({
          code: 'IMAGE_NOT_FOUND',
          message: 'Source image was not found',
        });
      }
      throw error;
    }
  }

  private async cacheExists(path: string): Promise<boolean> {
    try {
      return (await stat(path)).isFile();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
      throw error;
    }
  }

  private async publishCacheFile(
    temporaryPath: string,
    cachePath: string,
  ): Promise<void> {
    try {
      await rename(temporaryPath, cachePath);
    } finally {
      await unlink(temporaryPath).catch(() => undefined);
    }
  }

  private cacheKey(
    filename: string,
    preset: ImagePreset,
    variant: (typeof IMAGE_PRESETS)[ImagePreset],
  ): string {
    return createHash('sha256')
      .update(
        `${filename}:${preset}:${variant.width}:${variant.height}:${variant.fit}:${WEBP_QUALITY}`,
      )
      .digest('hex');
  }

  private result(path: string, cacheKey: string): TransformedImage {
    return {
      path,
      contentType: 'image/webp',
      etag: `"${cacheKey}"`,
    };
  }

  private invalidSource(): BadRequestException {
    return new BadRequestException({
      code: 'IMAGE_SOURCE_INVALID',
      message: 'Source must reference an uploaded ProTravel image',
    });
  }
}
