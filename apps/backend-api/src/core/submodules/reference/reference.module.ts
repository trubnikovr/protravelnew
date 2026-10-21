import { Module } from '@nestjs/common';
import { ReferenceService } from './application/reference.service';

@Module({
  providers: [ReferenceService],
  exports: [ReferenceService],
})
export class ReferenceModule {}
