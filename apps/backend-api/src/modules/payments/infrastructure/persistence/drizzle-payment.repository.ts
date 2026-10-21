import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import type { PaymentRepository } from '../../application/payment.repository';
import type { Payment } from '../../domain/payment';
import { PaymentPersistenceMapper } from './payment-persistence.mapper';
import { paymentWebhooks, payments } from './payment.schema';

type PaymentInsert = typeof payments.$inferInsert;

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async save(payment: Payment): Promise<void> {
    const values = this.toInsert(payment);
    await this.database
      .insert(payments)
      .values(values)
      .onConflictDoUpdate({
        target: payments.id,
        set: {
          status: values.status,
          providerPaymentId: values.providerPaymentId,
          paymentMethod: values.paymentMethod,
          paymentUrl: values.paymentUrl,
          paidAt: values.paidAt,
          failureCode: values.failureCode,
          updatedAt: values.updatedAt,
        },
      });
  }

  findById(customerId: string, paymentId: string): Promise<Payment | null> {
    return this.findOne(
      and(eq(payments.id, paymentId), eq(payments.customerId, customerId)),
    );
  }

  findByIdempotencyKey(
    customerId: string,
    idempotencyKey: string,
  ): Promise<Payment | null> {
    return this.findOne(
      and(
        eq(payments.customerId, customerId),
        eq(payments.idempotencyKey, idempotencyKey),
      ),
    );
  }

  findByProviderOrderId(
    provider: string,
    providerOrderId: string,
  ): Promise<Payment | null> {
    return this.findOne(
      and(
        eq(payments.provider, provider),
        eq(payments.providerOrderId, providerOrderId),
      ),
    );
  }

  async recordWebhook(
    provider: string,
    eventKey: string,
    payload: Record<string, unknown>,
  ): Promise<boolean> {
    const inserted = await this.database
      .insert(paymentWebhooks)
      .values({ provider, eventKey, payload, processedAt: new Date() })
      .onConflictDoNothing()
      .returning({ id: paymentWebhooks.id });
    return inserted.length > 0;
  }

  private async findOne(
    where: ReturnType<typeof and>,
  ): Promise<Payment | null> {
    const [record] = await this.database
      .select()
      .from(payments)
      .where(where)
      .limit(1);
    return record ? PaymentPersistenceMapper.toDomain(record) : null;
  }

  private toInsert(payment: Payment): PaymentInsert {
    return {
      id: payment.id.toString(),
      customerId: payment.customerId,
      payableType: payment.payableType,
      payableId: payment.payableId,
      idempotencyKey: payment.idempotencyKey,
      status: payment.status,
      totalAmount: payment.amount.amount,
      currency: payment.amount.currency,
      provider: payment.provider,
      providerOrderId: payment.providerOrderId,
      providerPaymentId: payment.providerPaymentId,
      paymentMethod: payment.paymentMethod,
      paymentUrl: payment.paymentUrl,
      expiresAt: payment.expiresAt.toDate(),
      paidAt: payment.paidAt?.toDate() ?? null,
      failureCode: payment.failureCode,
      createdAt: payment.createdAt.toDate(),
      updatedAt: payment.updatedAt.toDate(),
    };
  }
}
