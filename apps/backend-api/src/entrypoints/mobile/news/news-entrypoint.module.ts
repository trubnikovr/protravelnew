import { Module } from '@nestjs/common';
import { ContentModule } from '@modules/content';
import { NewsController } from './news.controller';

@Module({
  imports: [ContentModule],
  controllers: [NewsController],
})
export class NewsEntrypointModule {}
