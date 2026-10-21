import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { StoredImage } from '../domain/stored-image';

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

@Injectable()
export class LocalImageStorageService {
  private readonly directory: string;

  constructor(config: ConfigService) {
    this.directory = resolve(
      config.getOrThrow<string>('UPLOAD_DIRECTORY'),
      'images',
    );
  }

  async store(file: Express.Multer.File): Promise<StoredImage> {
    const extension = extensions[file.mimetype];
    if (!extension) throw new Error('Unsupported image type');
    await mkdir(this.directory, { recursive: true });
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(resolve(this.directory, filename), file.buffer, {
      flag: 'wx',
    });
    return StoredImage.create({
      filename,
      mimeType: file.mimetype,
      size: file.size,
    });
  }
}
