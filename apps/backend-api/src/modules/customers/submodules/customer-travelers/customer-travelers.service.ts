import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, count, desc, eq, inArray } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import { EnsureCustomerExistsUseCase } from '@modules/customers';
import { DocumentCipherService } from './document-cipher.service';
import {
  travelerDocuments,
  travelers,
} from './infrastructure/persistence/traveler.schema';
import type { Traveler } from './domain/traveler';
import type {
  TravelerDocumentType,
  TravelerGender,
  TravelerRelationship,
} from './domain/traveler.types';
import {
  TravelerCreatedDomainEvent,
  TravelerDeletedDomainEvent,
  TravelerDocumentCreatedDomainEvent,
  TravelerDocumentDeletedDomainEvent,
  TravelerDocumentUpdatedDomainEvent,
  TravelerUpdatedDomainEvent,
} from './domain/traveler.events';
import { TravelerPersistenceMapper } from './infrastructure/persistence/traveler-persistence.mapper';
import type { TravelerForTourBookingContract } from '@shared/contracts';

export interface TravelerInput {
  relationship: TravelerRelationship;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  firstNameLatin?: string | null;
  lastNameLatin?: string | null;
  gender: TravelerGender;
  birthDate?: string | null;
  citizenshipCountryCode?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface TravelerDocumentInput {
  type: TravelerDocumentType;
  number: string;
  issuingCountryCode: string;
  issuedAt?: string | null;
  expiresAt?: string | null;
  firstNameLatin: string;
  lastNameLatin: string;
  fileId?: string | null;
}

export interface TravelerListFilter {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'updatedAt' | 'firstName' | 'lastName';
  sortDirection: 'asc' | 'desc';
}

export interface TravelerListResult {
  items: Traveler[];
  total: number;
}

export interface BookingTravelerSelection {
  travelerId: string;
  documentId: string;
  passengerType: 'adult' | 'child' | 'infant';
}

export interface BookingTravelerSnapshot {
  travelerId: string;
  documentId: string;
  passengerType: BookingTravelerSelection['passengerType'];
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: TravelerGender;
  birthDate: string;
  citizenshipCountryCode: string;
  document: {
    type: TravelerDocumentType;
    number: string;
    issuingCountryCode: string;
    issuedAt: string | null;
    expiresAt: string | null;
    firstNameLatin: string;
    lastNameLatin: string;
  };
}

@Injectable()
export class CustomerTravelersService {
  constructor(
    @Inject(DRIZZLE_DB) private readonly database: Database,
    private readonly ensureCustomer: EnsureCustomerExistsUseCase,
    private readonly cipher: DocumentCipherService,
    private readonly events: DomainEventPublisher,
  ) {}

  async list(
    customerId: string,
    filter: TravelerListFilter,
  ): Promise<TravelerListResult> {
    await this.ensureCustomer.execute(customerId);
    const where = eq(travelers.customerId, customerId);
    const [totalRecord] = await this.database
      .select({ value: count() })
      .from(travelers)
      .where(where);
    const sortColumn = {
      createdAt: travelers.createdAt,
      updatedAt: travelers.updatedAt,
      firstName: travelers.firstName,
      lastName: travelers.lastName,
    }[filter.sortBy];
    const records = await this.database
      .select()
      .from(travelers)
      .where(where)
      .orderBy(
        filter.sortDirection === 'asc' ? asc(sortColumn) : desc(sortColumn),
        desc(travelers.id),
      )
      .limit(filter.limit)
      .offset((filter.page - 1) * filter.limit);
    const ids = records.map((record) => record.id);
    const documents = ids.length
      ? await this.database
          .select()
          .from(travelerDocuments)
          .where(inArray(travelerDocuments.travelerId, ids))
      : [];
    return {
      items: records.map((record) => this.toView(record, documents)),
      total: totalRecord.value,
    };
  }

  async create(customerId: string, input: TravelerInput): Promise<Traveler> {
    await this.ensureCustomer.execute(customerId);
    try {
      const [created] = await this.database
        .insert(travelers)
        .values({ customerId, ...input })
        .returning();
      const view = this.toView(created, []);
      this.events.publish(
        new TravelerCreatedDomainEvent(created.id, { customerId }),
      );
      return view;
    } catch (error) {
      this.rethrowSelfConflict(error);
    }
  }

  async update(
    customerId: string,
    travelerId: string,
    input: Partial<TravelerInput>,
  ): Promise<Traveler> {
    await this.requireTraveler(customerId, travelerId);
    try {
      const [updated] = await this.database
        .update(travelers)
        .set({ ...input, updatedAt: new Date() })
        .where(
          and(
            eq(travelers.id, travelerId),
            eq(travelers.customerId, customerId),
          ),
        )
        .returning();
      const documents = await this.database
        .select()
        .from(travelerDocuments)
        .where(eq(travelerDocuments.travelerId, travelerId));
      const view = this.toView(updated, documents);
      this.events.publish(
        new TravelerUpdatedDomainEvent(travelerId, { customerId }),
      );
      return view;
    } catch (error) {
      this.rethrowSelfConflict(error);
    }
  }

  async delete(customerId: string, travelerId: string): Promise<void> {
    await this.requireTraveler(customerId, travelerId);
    await this.database.delete(travelers).where(eq(travelers.id, travelerId));
    this.events.publish(
      new TravelerDeletedDomainEvent(travelerId, { customerId }),
    );
  }

  async addDocument(
    customerId: string,
    travelerId: string,
    input: TravelerDocumentInput,
  ): Promise<Traveler> {
    await this.requireTraveler(customerId, travelerId);
    const encrypted = this.cipher.encrypt(input.number);
    await this.database.insert(travelerDocuments).values({
      travelerId,
      type: input.type,
      numberEncrypted: encrypted.encrypted,
      numberIv: encrypted.iv,
      numberAuthTag: encrypted.authTag,
      numberLast4: encrypted.last4,
      issuingCountryCode: input.issuingCountryCode,
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt,
      firstNameLatin: input.firstNameLatin,
      lastNameLatin: input.lastNameLatin,
      fileId: input.fileId,
    });
    this.events.publish(
      new TravelerDocumentCreatedDomainEvent(travelerId, {
        customerId,
        travelerId,
      }),
    );
    return this.requireTraveler(customerId, travelerId);
  }

  async getBookingSnapshots(
    customerId: string,
    selections: BookingTravelerSelection[],
  ): Promise<BookingTravelerSnapshot[]> {
    const travelerIds = [
      ...new Set(selections.map(({ travelerId }) => travelerId)),
    ];
    const documentIds = [
      ...new Set(selections.map(({ documentId }) => documentId)),
    ];
    const [travelerRecords, documentRecords] = await Promise.all([
      this.database
        .select()
        .from(travelers)
        .where(
          and(
            eq(travelers.customerId, customerId),
            inArray(travelers.id, travelerIds),
          ),
        ),
      this.database
        .select()
        .from(travelerDocuments)
        .where(inArray(travelerDocuments.id, documentIds)),
    ]);
    const travelerById = new Map(
      travelerRecords.map((item) => [item.id, item]),
    );
    const documentById = new Map(
      documentRecords.map((item) => [item.id, item]),
    );
    return selections.map((selection) => {
      const traveler = travelerById.get(selection.travelerId);
      const document = documentById.get(selection.documentId);
      if (!traveler || !document || document.travelerId !== traveler.id) {
        this.notFound(
          'BOOKING_TRAVELER_NOT_FOUND',
          'Traveler or selected document not found',
        );
      }
      if (!traveler.birthDate || !traveler.citizenshipCountryCode) {
        throw new ConflictException({
          code: 'BOOKING_TRAVELER_INCOMPLETE',
          message:
            'Traveler birth date and citizenship are required for booking',
        });
      }
      return {
        travelerId: traveler.id,
        documentId: document.id,
        passengerType: selection.passengerType,
        firstName: document.firstNameLatin,
        lastName: document.lastNameLatin,
        middleName: traveler.middleName,
        gender: traveler.gender,
        birthDate: traveler.birthDate,
        citizenshipCountryCode: traveler.citizenshipCountryCode,
        document: {
          type: document.type,
          number: this.cipher.decrypt({
            encrypted: document.numberEncrypted,
            iv: document.numberIv,
            authTag: document.numberAuthTag,
          }),
          issuingCountryCode: document.issuingCountryCode,
          issuedAt: document.issuedAt,
          expiresAt: document.expiresAt,
          firstNameLatin: document.firstNameLatin,
          lastNameLatin: document.lastNameLatin,
        },
      };
    });
  }

  async getTourBookingTravelers(
    customerId: string,
    travelerIds: string[],
  ): Promise<TravelerForTourBookingContract[]> {
    const uniqueIds = [...new Set(travelerIds)];
    if (uniqueIds.length !== travelerIds.length) {
      throw new BadRequestException({
        code: 'TOUR_BOOKING_TRAVELERS_INVALID',
        message: 'Travelers must be unique',
      });
    }
    const records = await this.database
      .select()
      .from(travelers)
      .where(
        and(
          eq(travelers.customerId, customerId),
          inArray(travelers.id, uniqueIds),
        ),
      );
    if (records.length !== uniqueIds.length) {
      this.notFound(
        'TOUR_BOOKING_TRAVELER_NOT_FOUND',
        'One or more travelers were not found',
      );
    }
    const byId = new Map(records.map((record) => [record.id, record]));
    return travelerIds.map((id) => {
      const traveler = byId.get(id)!;
      return {
        travelerId: traveler.id,
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        middleName: traveler.middleName,
        gender: traveler.gender,
        birthDate: traveler.birthDate,
        citizenshipCountryCode: traveler.citizenshipCountryCode,
      };
    });
  }

  async updateDocument(
    customerId: string,
    travelerId: string,
    documentId: string,
    input: Partial<TravelerDocumentInput>,
  ): Promise<Traveler> {
    await this.requireDocument(customerId, travelerId, documentId);
    const { number, ...columns } = input;
    const encrypted = number ? this.cipher.encrypt(number) : null;
    await this.database
      .update(travelerDocuments)
      .set({
        ...columns,
        ...(encrypted
          ? {
              numberEncrypted: encrypted.encrypted,
              numberIv: encrypted.iv,
              numberAuthTag: encrypted.authTag,
              numberLast4: encrypted.last4,
            }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(travelerDocuments.id, documentId));
    this.events.publish(
      new TravelerDocumentUpdatedDomainEvent(documentId, {
        customerId,
        travelerId,
      }),
    );
    return this.requireTraveler(customerId, travelerId);
  }

  async deleteDocument(
    customerId: string,
    travelerId: string,
    documentId: string,
  ): Promise<void> {
    await this.requireDocument(customerId, travelerId, documentId);
    await this.database
      .delete(travelerDocuments)
      .where(eq(travelerDocuments.id, documentId));
    this.events.publish(
      new TravelerDocumentDeletedDomainEvent(documentId, {
        customerId,
        travelerId,
      }),
    );
  }

  private async requireTraveler(
    customerId: string,
    travelerId: string,
  ): Promise<Traveler> {
    const [record] = await this.database
      .select()
      .from(travelers)
      .where(
        and(eq(travelers.id, travelerId), eq(travelers.customerId, customerId)),
      )
      .limit(1);
    if (!record) this.notFound('TRAVELER_NOT_FOUND', 'Traveler not found');
    const documents = await this.database
      .select()
      .from(travelerDocuments)
      .where(eq(travelerDocuments.travelerId, travelerId));
    return this.toView(record, documents);
  }

  private async requireDocument(
    customerId: string,
    travelerId: string,
    documentId: string,
  ): Promise<void> {
    await this.requireTraveler(customerId, travelerId);
    const [document] = await this.database
      .select({ id: travelerDocuments.id })
      .from(travelerDocuments)
      .where(
        and(
          eq(travelerDocuments.id, documentId),
          eq(travelerDocuments.travelerId, travelerId),
        ),
      )
      .limit(1);
    if (!document)
      this.notFound('TRAVELER_DOCUMENT_NOT_FOUND', 'Document not found');
  }

  private toView(
    record: Parameters<typeof TravelerPersistenceMapper.toDomain>[0],
    documents: Parameters<typeof TravelerPersistenceMapper.toDomain>[1],
  ): Traveler {
    return TravelerPersistenceMapper.toDomain(record, documents);
  }

  private rethrowSelfConflict(error: unknown): never {
    if (
      typeof error === 'object' &&
      error &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw new ConflictException({
        code: 'CUSTOMER_SELF_TRAVELER_EXISTS',
        message: 'Customer already has a self traveler',
      });
    }
    throw error;
  }

  private notFound(code: string, message: string): never {
    throw new NotFoundException({ code, message });
  }
}
