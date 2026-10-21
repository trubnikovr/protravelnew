import {
  DateTimeValueObject,
  EmailValueObject,
  EntityIdValueObject,
  TimeZoneValueObject,
} from '@shared/domain/value-objects';
import { Customer } from '../../domain/customer';
import type { CustomerRecord } from './customer.schema';

export class CustomerPersistenceMapper {
  static toDomain(record: CustomerRecord): Customer {
    return Customer.restore({
      id: EntityIdValueObject.fromString(record.id),
      phone: record.phone,
      email: record.email ? EmailValueObject.create(record.email) : null,
      firstName: record.firstName,
      lastName: record.lastName,
      locale: record.locale,
      currency: record.currency,
      timeZone: TimeZoneValueObject.create(record.timeZone),
      status: record.status,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    });
  }
}
