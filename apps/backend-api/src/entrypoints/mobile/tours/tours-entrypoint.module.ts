import { Module } from '@nestjs/common';
import { ToursModule } from '@modules/tours';
import { ToursController } from './tours.controller';

@Module({ imports: [ToursModule], controllers: [ToursController] })
export class ToursEntrypointModule {}
