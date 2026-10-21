import { Module } from '@nestjs/common';
import { ToursModule } from '@modules/tours';
import { HomeController } from './home.controller';

@Module({
  imports: [ToursModule],
  controllers: [HomeController],
})
export class HomeEntrypointModule {}
