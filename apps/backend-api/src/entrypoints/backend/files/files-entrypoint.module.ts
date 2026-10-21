import { Module } from '@nestjs/common';
import { FilesModule } from '@core/submodules/files';
import { ImageTransformController } from './image-transform.controller';

@Module({
  imports: [FilesModule],
  controllers: [ImageTransformController],
})
export class FilesEntrypointModule {}
