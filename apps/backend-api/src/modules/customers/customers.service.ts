import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import {
  customers,
  type CustomerRecord,
} from './infrastructure/persistence/customer.schema';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import { CustomerEventMapper } from './application/mappers/customer-event.mapper';
import { CustomerStatus } from './domain/customer.types';
import type { Customer } from './domain/customer';
import { CustomerPersistenceMapper } from './infrastructure/persistence/customer-persistence.mapper';

export type PublicCustomer = Omit<CustomerRecord, 'passwordHash'>;

export interface AdminCustomerInput {
  phone: string;
  email?: string | null;
  firstName: string;
  lastName: string;
  locale: CustomerRecord['locale'];
  currency: CustomerRecord['currency'];
  timeZone: string;
  status: CustomerStatus;
}

export interface CustomerProfileInput {
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  email?: string | null;
  locale?: CustomerRecord['locale'];
  currency?: CustomerRecord['currency'];
  timeZone?: string;
}

@Injectable()
export class CustomersService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly database: Database,
    private readonly events: DomainEventPublisher,
  ) {}

  async findOrCreateByPhone(phone: string): Promise<CustomerRecord> {
    const existing = await this.findByPhone(phone);
    if (existing) return existing;
    try {
      const [created] = await this.database
        .insert(customers)
        .values({ phone, firstName: '' })
        .returning();
      this.publishCreated(created);
      return created;
    } catch (error) {
      if (this.postgresCode(error) !== '23505') throw error;
      const concurrent = await this.findByPhone(phone);
      if (concurrent) return concurrent;
      throw error;
    }
  }

  async findByPhone(phone: string): Promise<CustomerRecord | null> {
    const [customer] = await this.database
      .select()
      .from(customers)
      .where(eq(customers.phone, phone))
      .limit(1);
    return customer ?? null;
  }

  async createForAdmin(input: AdminCustomerInput): Promise<Customer> {
    try {
      const [created] = await this.database
        .insert(customers)
        .values({
          ...this.normalizedInput(input),
          phone: input.phone.trim(),
          firstName: input.firstName,
        })
        .returning();
      this.publishCreated(created);
      return CustomerPersistenceMapper.toDomain(created);
    } catch (error) {
      this.rethrowIdentityConflict(error);
    }
  }

  async updateForAdmin(
    id: string,
    input: Partial<AdminCustomerInput>,
  ): Promise<Customer> {
    await this.findById(id);
    const updated = await this.updateCustomerRecord(id, input);
    this.events.publish(CustomerEventMapper.toUpdated(id));
    return CustomerPersistenceMapper.toDomain(updated);
  }

  async deleteForAdmin(id: string): Promise<void> {
    await this.findById(id);
    try {
      await this.database.delete(customers).where(eq(customers.id, id));
    } catch (error) {
      this.rethrowCustomerHasOrders(error);
    }
    this.events.publish(CustomerEventMapper.toDeleted(id));
  }

  async findById(id: string): Promise<CustomerRecord> {
    const [user] = await this.database
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);
    if (!user) {
      throw new NotFoundException({
        code: 'CUSTOMER_NOT_FOUND',
        message: 'Customer not found',
      });
    }
    return user;
  }

  async updateProfile(
    id: string,
    input: CustomerProfileInput,
  ): Promise<CustomerRecord> {
    await this.findById(id);
    const [updated] = await this.database
      .update(customers)
      .set({ ...this.normalizedInput(input), updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();

    return updated;
  }

  async listForAdmin(input: {
    page: number;
    limit: number;
    search?: string;
    status?: CustomerStatus;
    sortBy: 'createdAt' | 'updatedAt' | 'email' | 'firstName';
    sortDirection: 'asc' | 'desc';
  }): Promise<{ items: Customer[]; total: number }> {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = `%${input.search}%`;
      const searchCondition = or(
        ilike(customers.phone, search),
        ilike(customers.email, search),
        ilike(customers.firstName, search),
        ilike(customers.lastName, search),
      );
      if (searchCondition) conditions.push(searchCondition);
    }
    if (input.status) conditions.push(eq(customers.status, input.status));
    const where = conditions.length ? and(...conditions) : undefined;
    const [total] = await this.database
      .select({ value: count() })
      .from(customers)
      .where(where);
    const sortColumn = {
      createdAt: customers.createdAt,
      updatedAt: customers.updatedAt,
      email: customers.email,
      firstName: customers.firstName,
    }[input.sortBy];
    const records = await this.database
      .select()
      .from(customers)
      .where(where)
      .orderBy(
        input.sortDirection === 'asc' ? asc(sortColumn) : desc(sortColumn),
        desc(customers.id),
      )
      .limit(input.limit)
      .offset((input.page - 1) * input.limit);
    return {
      items: records.map((record) =>
        CustomerPersistenceMapper.toDomain(record),
      ),
      total: total.value,
    };
  }

  async updateStatus(id: string, status: CustomerStatus): Promise<Customer> {
    await this.findById(id);
    const [updated] = await this.database
      .update(customers)
      .set({ status, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    this.events.publish(CustomerEventMapper.toStatusChanged(id, status));
    return CustomerPersistenceMapper.toDomain(updated);
  }

  toDomain(user: CustomerRecord): Customer {
    return CustomerPersistenceMapper.toDomain(user);
  }

  toPublic(user: CustomerRecord): PublicCustomer {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    void _passwordHash;
    return publicUser;
  }

  private async updateCustomerRecord(
    id: string,
    input: Partial<AdminCustomerInput>,
  ): Promise<CustomerRecord> {
    try {
      const [updated] = await this.database
        .update(customers)
        .set({ ...this.normalizedInput(input), updatedAt: new Date() })
        .where(eq(customers.id, id))
        .returning();
      return updated;
    } catch (error) {
      this.rethrowIdentityConflict(error);
    }
  }

  private normalizedInput(input: Partial<AdminCustomerInput>) {
    return {
      ...input,
      ...(input.phone ? { phone: input.phone.trim() } : {}),
      ...('email' in input
        ? { email: input.email?.trim().toLowerCase() || null }
        : {}),
    };
  }

  private publishCreated(customer: CustomerRecord): void {
    this.events.publish(CustomerEventMapper.toCreated(customer.id));
  }

  private rethrowIdentityConflict(error: unknown): never {
    if (this.postgresCode(error) === '23505') {
      throw new ConflictException({
        code: 'CUSTOMER_IDENTITY_ALREADY_EXISTS',
        message: 'A customer with this phone or email already exists',
      });
    }
    throw error;
  }

  private rethrowCustomerHasOrders(error: unknown): never {
    if (this.postgresCode(error) === '23503') {
      throw new ConflictException({
        code: 'CUSTOMER_HAS_ORDERS',
        message: 'A customer with order history cannot be deleted',
      });
    }
    throw error;
  }

  private postgresCode(error: unknown): string | undefined {
    return error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : undefined;
  }
}
