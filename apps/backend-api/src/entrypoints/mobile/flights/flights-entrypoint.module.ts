import { Module } from '@nestjs/common';
import { FlightsModule } from '@modules/flights';
import { FlightsController } from './flights.controller';

@Module({ imports: [FlightsModule], controllers: [FlightsController] })
export class FlightsEntrypointModule {}
