import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Temporal } from '@js-temporal/polyfill';
import { LocalDateValueObject } from '@shared/domain/value-objects';
import type { ApplicationClock } from './application-clock';

@Injectable()
export class SystemClock implements ApplicationClock {
  constructor(private readonly config: ConfigService) {}

  today(): LocalDateValueObject {
    const timeZone = this.config.getOrThrow<string>('APP_TIME_ZONE');
    return LocalDateValueObject.create(
      Temporal.Now.instant()
        .toZonedDateTimeISO(timeZone)
        .toPlainDate()
        .toString(),
    );
  }
}
