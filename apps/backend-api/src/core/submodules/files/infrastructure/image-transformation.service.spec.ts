import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { ImagePreset } from '../application/image-transform.types';
import { ImageTransformationService } from './image-transformation.service';

describe('ImageTransformationService', () => {
  const filename = '550e8400-e29b-41d4-a716-446655440000.jpg';
  let uploads: string;
  let service: ImageTransformationService;

  beforeEach(async () => {
    uploads = await mkdtemp(join(tmpdir(), 'protravel-image-transform-'));
    await mkdir(join(uploads, 'images'));
    await sharp({
      create: {
        width: 400,
        height: 300,
        channels: 3,
        background: '#7554E8',
      },
    })
      .jpeg()
      .toFile(join(uploads, 'images', filename));
    service = new ImageTransformationService(
      new ConfigService({
        API_PREFIX: 'api',
        PUBLIC_API_URL: 'http://localhost:3000',
        UPLOAD_DIRECTORY: uploads,
      }),
    );
  });

  afterEach(async () => {
    await rm(uploads, { recursive: true, force: true });
  });

  it('generates and reuses an exact-size WebP file', async () => {
    const input = {
      src: `/api/v1/files/images/${filename}`,
      preset: ImagePreset.HOME_CARD,
    };

    const first = await service.transform(input, 'http://localhost:3000');
    const second = await service.transform(input, 'http://localhost:3000');
    const metadata = await sharp(first.path).metadata();

    expect(second.path).toBe(first.path);
    expect(metadata).toMatchObject({ format: 'webp', width: 600, height: 420 });
  });

  it('rejects external source URLs', async () => {
    await expect(
      service.transform(
        {
          src: `http://169.254.169.254/${filename}`,
          preset: ImagePreset.HOME_CARD,
        },
        'http://localhost:3000',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
