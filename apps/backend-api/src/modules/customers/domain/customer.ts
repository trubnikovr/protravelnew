import { CurrencyCode, SupportedLocale } from '@shared/domain/enums';
import {
  EmailValueObject,
  TimeZoneValueObject,
} from '@shared/domain/value-objects';
import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import { CustomerStatus } from './customer.types';

export interface CustomerProperties extends DomainEntityProperties {
  phone: string | null;
  email: EmailValueObject | null;
  firstName: string;
  lastName: string | null;
  locale: SupportedLocale;
  currency: CurrencyCode;
  timeZone: TimeZoneValueObject;
  status: CustomerStatus;
}

export class Customer extends DomainEntity<CustomerProperties> {
  private constructor(private readonly properties: CustomerProperties) {
    super(properties);
  }
  static restore(properties: CustomerProperties): Customer {
    return new Customer(properties);
  }
  get email() {
    return this.properties.email;
  }
  get phone() {
    return this.properties.phone;
  }
  get firstName() {
    return this.properties.firstName;
  }
  get lastName() {
    return this.properties.lastName;
  }
  get locale() {
    return this.properties.locale;
  }
  get currency() {
    return this.properties.currency;
  }
  get timeZone() {
    return this.properties.timeZone;
  }
  get status() {
    return this.properties.status;
  }
}
