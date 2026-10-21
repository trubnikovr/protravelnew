import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import { SupportedLocale } from '@shared/domain/enums';

export interface ReferenceCountryProperties extends DomainEntityProperties {
  isoCode: string;
  nameRu: string;
  nameUz: string | null;
  nameEn: string | null;
}

export class ReferenceCountry extends DomainEntity<ReferenceCountryProperties> {
  static restore(properties: ReferenceCountryProperties): ReferenceCountry {
    return new ReferenceCountry(properties);
  }

  get isoCode(): string {
    return this.entityProperties.isoCode;
  }

  name(locale: SupportedLocale): string {
    void locale;
    return this.entityProperties.nameRu;
  }
}
