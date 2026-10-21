import { Module } from '@nestjs/common';
import { ContentModule } from '@modules/content';
import { SystemMessagesController } from './system-messages.controller';

@Module({
  imports: [ContentModule],
  controllers: [SystemMessagesController],
})
export class SystemMessagesEntrypointModule {}
