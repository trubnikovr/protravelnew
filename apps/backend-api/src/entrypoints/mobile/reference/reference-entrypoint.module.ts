import { Module } from '@nestjs/common';
import { ReferenceModule } from '@core/submodules/reference';
import { ReferenceController } from './reference.controller';

@Module({
  imports: [ReferenceModule],
  controllers: [ReferenceController],
})
export class ReferenceEntrypointModule {}
