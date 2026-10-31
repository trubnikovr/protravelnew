import { Module } from '@nestjs/common';
import { ContentModule } from '@modules/content';
import { TravelFactsController } from './travel-facts.controller';

@Module({ imports: [ContentModule], controllers: [TravelFactsController] })
export class TravelFactsEntrypointModule {}
