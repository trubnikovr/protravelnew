import {
  DateTimeValueObject,
  EntityIdValueObject,
  LocalDateValueObject,
} from '@shared/domain/value-objects';
import { Traveler, TravelerDocument } from '../../domain/traveler';
import type { TravelerDocumentRecord, TravelerRecord } from './traveler.schema';

export class TravelerPersistenceMapper {
  static toDomain(
    record: TravelerRecord,
    records: TravelerDocumentRecord[],
  ): Traveler {
    const documents = records
      .filter(({ travelerId }) => travelerId === record.id)
      .map((document) =>
        TravelerDocument.restore({
          id: EntityIdValueObject.fromString(document.id),
          type: document.type,
          maskedNumber: `•••• ${document.numberLast4}`,
          issuingCountryCode: document.issuingCountryCode,
          issuedAt: document.issuedAt
            ? LocalDateValueObject.create(document.issuedAt)
            : null,
          expiresAt: document.expiresAt
            ? LocalDateValueObject.create(document.expiresAt)
            : null,
          firstNameLatin: document.firstNameLatin,
          lastNameLatin: document.lastNameLatin,
          fileId: document.fileId
            ? EntityIdValueObject.fromString(document.fileId)
            : null,
          createdAt: DateTimeValueObject.fromDate(document.createdAt),
          updatedAt: DateTimeValueObject.fromDate(document.updatedAt),
        }),
      );
    return Traveler.restore({
      id: EntityIdValueObject.fromString(record.id),
      customerId: EntityIdValueObject.fromString(record.customerId),
      relationship: record.relationship,
      firstName: record.firstName,
      lastName: record.lastName,
      middleName: record.middleName,
      firstNameLatin: record.firstNameLatin,
      lastNameLatin: record.lastNameLatin,
      gender: record.gender,
      birthDate: record.birthDate
        ? LocalDateValueObject.create(record.birthDate)
        : null,
      citizenshipCountryCode: record.citizenshipCountryCode,
      phone: record.phone,
      email: record.email,
      documents,
      createdAt: DateTimeValueObject.fromDate(record.createdAt),
      updatedAt: DateTimeValueObject.fromDate(record.updatedAt),
    });
  }
}
