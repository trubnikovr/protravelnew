import { sql } from 'drizzle-orm';
import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { customers } from '../../../../infrastructure/persistence/customer.schema';
import {
  TravelerDocumentType,
  TravelerGender,
  TravelerRelationship,
} from '../../domain/traveler.types';

export const travelerRelationship = pgEnum('traveler_relationship', [
  'self',
  'spouse',
  'child',
  'parent',
  'sibling',
  'other',
]);
export const travelerGender = pgEnum('traveler_gender', [
  'male',
  'female',
  'unspecified',
]);
export const travelerDocumentType = pgEnum('traveler_document_type', [
  'national_passport',
  'international_passport',
  'id_card',
  'birth_certificate',
]);

export const travelers = pgTable(
  'travelers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    relationship: travelerRelationship('relationship')
      .$type<TravelerRelationship>()
      .notNull(),
    firstName: varchar('first_name', { length: 80 }).notNull(),
    lastName: varchar('last_name', { length: 80 }).notNull(),
    middleName: varchar('middle_name', { length: 80 }),
    firstNameLatin: varchar('first_name_latin', { length: 80 }),
    lastNameLatin: varchar('last_name_latin', { length: 80 }),
    gender: travelerGender('gender')
      .$type<TravelerGender>()
      .notNull()
      .default(TravelerGender.UNSPECIFIED),
    birthDate: date('birth_date'),
    citizenshipCountryCode: varchar('citizenship_country_code', { length: 2 }),
    phone: varchar('phone', { length: 32 }),
    email: varchar('email', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('travelers_customer_idx').on(table.customerId),
    uniqueIndex('travelers_single_self_per_customer_unique')
      .on(table.customerId)
      .where(sql`${table.relationship} = 'self'`),
  ],
);

export const travelerDocuments = pgTable(
  'traveler_documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    travelerId: uuid('traveler_id')
      .notNull()
      .references(() => travelers.id, { onDelete: 'cascade' }),
    type: travelerDocumentType('type').$type<TravelerDocumentType>().notNull(),
    numberEncrypted: text('number_encrypted').notNull(),
    numberIv: varchar('number_iv', { length: 24 }).notNull(),
    numberAuthTag: varchar('number_auth_tag', { length: 24 }).notNull(),
    numberLast4: varchar('number_last4', { length: 4 }).notNull(),
    issuingCountryCode: varchar('issuing_country_code', {
      length: 2,
    }).notNull(),
    issuedAt: date('issued_at'),
    expiresAt: date('expires_at'),
    firstNameLatin: varchar('first_name_latin', { length: 80 }).notNull(),
    lastNameLatin: varchar('last_name_latin', { length: 80 }).notNull(),
    fileId: uuid('file_id'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('traveler_documents_traveler_idx').on(table.travelerId),
    index('traveler_documents_expiry_idx').on(table.expiresAt),
  ],
);

export type TravelerRecord = typeof travelers.$inferSelect;
export type TravelerDocumentRecord = typeof travelerDocuments.$inferSelect;
