import type { LocalDateValueObject } from '@shared/domain/value-objects';

export const APPLICATION_CLOCK = Symbol('APPLICATION_CLOCK');

export interface ApplicationClock {
  today(): LocalDateValueObject;
}
