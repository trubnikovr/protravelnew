import { Module } from '@nestjs/common';
import { HealthEntrypointModule } from './health/health-entrypoint.module';
import { FilesEntrypointModule } from './files/files-entrypoint.module';

@Module({
  imports: [FilesEntrypointModule, HealthEntrypointModule],
})
export class BackendEntrypointModule {}
