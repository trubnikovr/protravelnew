import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StoredDocument } from '../domain/stored-document';

const extensions: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

@Injectable()
export class LocalDocumentStorageService {
  private readonly directory: string;

  constructor(config: ConfigService) {
    this.directory = resolve(
      config.getOrThrow<string>('UPLOAD_DIRECTORY'),
      'private',
      'tour-bookings',
    );
  }

  async store(file: Express.Multer.File): Promise<StoredDocument> {
    const extension = extensions[file.mimetype];
    if (!extension) throw new Error('Unsupported document type');
    await mkdir(this.directory, { recursive: true });
    const storageKey = `${randomUUID()}.${extension}`;
    await writeFile(this.path(storageKey), file.buffer, { flag: 'wx' });
    return StoredDocument.create({
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  read(storageKey: string): Promise<Buffer> {
    return readFile(this.path(storageKey));
  }

  async delete(storageKey: string): Promise<void> {
    await unlink(this.path(storageKey)).catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') throw error;
      },
    );
  }

  private path(storageKey: string): string {
    if (!/^[a-f0-9-]+\.[a-z0-9]+$/.test(storageKey)) {
      throw new Error('Invalid document storage key');
    }
    return resolve(this.directory, storageKey);
  }
}
