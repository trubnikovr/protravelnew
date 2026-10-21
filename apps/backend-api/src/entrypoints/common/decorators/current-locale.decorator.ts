import { createParamDecorator } from '@nestjs/common';
import { SupportedLocale } from '@shared/domain/enums';

export const CurrentLocale = createParamDecorator(
  (): SupportedLocale => SupportedLocale.RU,
);
