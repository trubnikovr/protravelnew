import {
  EntityIdValueObject,
  LocalDateValueObject,
} from '@shared/domain/value-objects';
import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import {
  TravelerDocumentType,
  TravelerGender,
  TravelerRelationship,
} from './traveler.types';

export interface TravelerDocumentProperties extends DomainEntityProperties {
  type: TravelerDocumentType;
  maskedNumber: string;
  issuingCountryCode: string;
  issuedAt: LocalDateValueObject | null;
  expiresAt: LocalDateValueObject | null;
  firstNameLatin: string;
  lastNameLatin: string;
  fileId: EntityIdValueObject | null;
}

export class TravelerDocument extends DomainEntity<TravelerDocumentProperties> {
  private constructor(private readonly properties: TravelerDocumentProperties) {
    super(properties);
  }
  static restore(properties: TravelerDocumentProperties): TravelerDocument {
    return new TravelerDocument(properties);
  }
  get type() {
    return this.properties.type;
  }
  get maskedNumber() {
    return this.properties.maskedNumber;
  }
  get issuingCountryCode() {
    return this.properties.issuingCountryCode;
  }
  get issuedAt() {
    return this.properties.issuedAt;
  }
  get expiresAt() {
    return this.properties.expiresAt;
  }
  get firstNameLatin() {
    return this.properties.firstNameLatin;
  }
  get lastNameLatin() {
    return this.properties.lastNameLatin;
  }
  get fileId() {
    return this.properties.fileId;
  }
}

export interface TravelerProperties extends DomainEntityProperties {
  customerId: EntityIdValueObject;
  relationship: TravelerRelationship;
  firstName: string;
  lastName: string;
  middleName: string | null;
  firstNameLatin: string | null;
  lastNameLatin: string | null;
  gender: TravelerGender;
  birthDate: LocalDateValueObject | null;
  citizenshipCountryCode: string | null;
  phone: string | null;
  email: string | null;
  documents: TravelerDocument[];
}

export class Traveler extends DomainEntity<TravelerProperties> {
  private constructor(private readonly properties: TravelerProperties) {
    super(properties);
  }
  static restore(properties: TravelerProperties): Traveler {
    return new Traveler(properties);
  }
  get customerId() {
    return this.properties.customerId;
  }
  get relationship() {
    return this.properties.relationship;
  }
  get firstName() {
    return this.properties.firstName;
  }
  get lastName() {
    return this.properties.lastName;
  }
  get middleName() {
    return this.properties.middleName;
  }
  get firstNameLatin() {
    return this.properties.firstNameLatin;
  }
  get lastNameLatin() {
    return this.properties.lastNameLatin;
  }
  get gender() {
    return this.properties.gender;
  }
  get birthDate() {
    return this.properties.birthDate;
  }
  get citizenshipCountryCode() {
    return this.properties.citizenshipCountryCode;
  }
  get phone() {
    return this.properties.phone;
  }
  get email() {
    return this.properties.email;
  }
  get documents(): readonly TravelerDocument[] {
    return this.properties.documents;
  }
}
