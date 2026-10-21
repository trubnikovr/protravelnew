import { Module } from '@nestjs/common';
import { ToursService } from './application/tours.service';
import { TOURS_REPOSITORY } from './application/tours.repository';
import { DrizzleToursRepository } from './infrastructure/persistence/drizzle-tours.repository';
import { ReferenceModule } from '@core/submodules/reference';
import { GetTourForBookingUseCase } from './application/use-cases/get-tour-for-booking.use-case';
import { HomeService } from './application/home.service';

@Module({
  imports: [ReferenceModule],
  providers: [
    ToursService,
    HomeService,
    { provide: TOURS_REPOSITORY, useClass: DrizzleToursRepository },
    GetTourForBookingUseCase,
  ],
  exports: [ToursService, HomeService, GetTourForBookingUseCase],
})
export class ToursModule {}
