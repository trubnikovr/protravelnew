import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import type { Response } from 'express';
import { resolve } from 'node:path';
import { LocalImageStorageService } from './infrastructure/local-image-storage.service';
import { LocalDocumentStorageService } from './infrastructure/local-document-storage.service';
import { ImageTransformationService } from './infrastructure/image-transformation.service';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: resolve(
            config.getOrThrow<string>('UPLOAD_DIRECTORY'),
            'images',
          ),
          serveRoot: '/v1/files/images',
          useGlobalPrefix: true,
          serveStaticOptions: {
            fallthrough: false,
            immutable: true,
            index: false,
            maxAge: '1y',
            setHeaders: (response: Response) => {
              response.setHeader(
                'Cross-Origin-Resource-Policy',
                'cross-origin',
              );
              response.setHeader('Access-Control-Allow-Origin', '*');
            },
          },
        },
      ],
    }),
  ],
  providers: [
    LocalImageStorageService,
    LocalDocumentStorageService,
    ImageTransformationService,
  ],
  exports: [
    LocalImageStorageService,
    LocalDocumentStorageService,
    ImageTransformationService,
  ],
})
export class FilesModule {}
