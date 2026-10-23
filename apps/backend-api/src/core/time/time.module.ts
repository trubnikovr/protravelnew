import { Module } from '@nestjs/common';
import { APPLICATION_CLOCK } from './application-clock';
import { SystemClock } from './system-clock';

@Module({
  providers: [
    SystemClock,
    { provide: APPLICATION_CLOCK, useExisting: SystemClock },
  ],
  exports: [APPLICATION_CLOCK],
})
export class TimeModule {}
