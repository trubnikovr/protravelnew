import { Inject, Injectable } from '@nestjs/common';
import { and, eq, type SQL } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import type { FlightOrderRepository } from '../../application/flight-order.repository';
import type { FlightOrder } from '../../domain/flight-order';
import { FlightOrderPersistenceMapper } from './flight-order-persistence.mapper';
import { flightOrders } from './flight-order.schema';

type FlightOrderInsert = typeof flightOrders.$inferInsert;

@Injectable()
export class DrizzleFlightOrderRepository implements FlightOrderRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async save(order: FlightOrder): Promise<void> {
    await this.database
      .insert(flightOrders)
      .values(this.toInsert(order))
      .onConflictDoUpdate({
        target: flightOrders.id,
        set: this.toUpdate(order),
      });
  }

  findById(customerId: string, orderId: string): Promise<FlightOrder | null> {
    return this.findOne(
      and(
        eq(flightOrders.id, orderId),
        eq(flightOrders.customerId, customerId),
      ),
    );
  }

  findByOrderId(orderId: string): Promise<FlightOrder | null> {
    return this.findOne(eq(flightOrders.id, orderId));
  }

  findByIdempotencyKey(
    customerId: string,
    key: string,
  ): Promise<FlightOrder | null> {
    return this.findOne(
      and(
        eq(flightOrders.customerId, customerId),
        eq(flightOrders.idempotencyKey, key),
      ),
    );
  }

  private async findOne(where: SQL | undefined): Promise<FlightOrder | null> {
    const [record] = await this.database
      .select()
      .from(flightOrders)
      .where(where)
      .limit(1);
    return record ? FlightOrderPersistenceMapper.toDomain(record) : null;
  }

  private toInsert(order: FlightOrder): FlightOrderInsert {
    return {
      ...this.identityColumns(order),
      ...this.businessColumns(order),
      ...this.bookingColumns(order),
      createdAt: order.createdAt.toDate(),
      updatedAt: order.updatedAt.toDate(),
    };
  }

  private identityColumns(order: FlightOrder) {
    return {
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      offerId: order.offerId.toString(),
      idempotencyKey: order.idempotencyKey,
    };
  }

  private businessColumns(order: FlightOrder) {
    return {
      status: order.status,
      provider: order.provider,
      contact: order.contact,
      travelers: [...order.travelers],
      offerSnapshot: order.offerSnapshot,
      totalAmount: order.offerSnapshot.totalAmount,
      currency: order.offerSnapshot.currency,
    };
  }

  private bookingColumns(order: FlightOrder) {
    return {
      providerBookingToken: order.providerBookingToken,
      recordLocator: order.recordLocator,
      bookingExpiresAt: order.bookingExpiresAt?.toDate() ?? null,
      providerStatus: order.providerStatus,
      failureCode: order.failureCode,
    };
  }

  private toUpdate(order: FlightOrder): Partial<FlightOrderInsert> {
    return {
      status: order.status,
      ...this.bookingColumns(order),
      updatedAt: order.updatedAt.toDate(),
    };
  }
}
