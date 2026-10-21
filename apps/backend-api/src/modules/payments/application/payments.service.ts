import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import { CurrencyCode } from '@shared/domain/enums';
import {
  DateTimeValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import { Payment } from '../domain/payment';
import { PaymentSucceededDomainEvent } from '../domain/payment.events';
import type { PaymentPayableType } from '../domain/payment.types';
import {
  PAYMENT_PROVIDER,
  type PaymentProviderPort,
} from './payment-provider.port';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepository,
} from './payment.repository';
import {
  PAYMENT_SUBJECT_READER,
  type PaymentSubjectReaderPort,
} from './payment-subject-reader.port';

const PAYMENT_TTL_MS = 30 * 60 * 1000;
const FLIGHT_EXPIRY_BUFFER_MS = 2 * 60 * 1000;

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepository,
    @Inject(PAYMENT_PROVIDER)
    private readonly provider: PaymentProviderPort,
    @Inject(PAYMENT_SUBJECT_READER)
    private readonly subjects: PaymentSubjectReaderPort,
    private readonly events: DomainEventPublisher,
    private readonly logger: PinoLogger,
  ) {}

  async create(input: {
    customerId: string;
    payableType: PaymentPayableType;
    payableId: string;
    idempotencyKey: string;
    returnUrl: string;
  }): Promise<Payment> {
    const existing = await this.repository.findByIdempotencyKey(
      input.customerId,
      input.idempotencyKey,
    );
    if (existing) return existing;
    const subject = await this.subjects.get(input.payableType, input.payableId);
    if (!subject || subject.customerId !== input.customerId) this.notFound();
    if (!subject.payable) {
      throw new ConflictException({
        code: 'PAYMENT_SUBJECT_NOT_PAYABLE',
        message: 'The selected order cannot be paid in its current status',
      });
    }
    if (subject.currency !== CurrencyCode.RUB) {
      throw new ConflictException({
        code: 'PAYMENT_CURRENCY_UNSUPPORTED',
        message: 'Raiffeisen payments require a RUB order total',
      });
    }
    const expiresAt = this.expiration(subject.expiresAt);
    const payment = Payment.create({
      customerId: input.customerId,
      payableType: input.payableType,
      payableId: input.payableId,
      idempotencyKey: input.idempotencyKey,
      amount: MoneyValueObject.create(subject.amount, subject.currency),
      provider: this.provider.name,
      expiresAt: DateTimeValueObject.fromDate(expiresAt),
    });
    await this.repository.save(payment);
    let result: { paymentUrl: string };
    try {
      result = await this.provider.createOrder({
        orderId: payment.providerOrderId,
        amount: payment.amount.amount,
        title: subject.title,
        expiresAt: expiresAt.toISOString(),
        returnUrl: `${input.returnUrl}?paymentId=${payment.id.toString()}`,
      });
    } catch (error) {
      payment.fail('PROVIDER_ORDER_FAILED');
      await this.repository.save(payment);
      throw error;
    }
    payment.ready(result.paymentUrl);
    await this.repository.save(payment);
    try {
      await this.subjects.startPayment(input.payableType, input.payableId);
    } catch (error) {
      payment.fail('PAYMENT_SUBJECT_UPDATE_FAILED');
      await this.repository.save(payment);
      throw error;
    }
    if (this.provider.name === 'mock') {
      payment.succeed(
        `mock-${payment.id.toString()}`,
        'ACQUIRING',
        DateTimeValueObject.now(),
      );
      await this.publishSucceeded(payment);
      await this.repository.save(payment);
    }
    return payment;
  }

  async get(customerId: string, paymentId: string): Promise<Payment> {
    const payment = await this.repository.findById(customerId, paymentId);
    if (!payment) this.notFound();
    return payment;
  }

  async handleRaiffeisenWebhook(
    signature: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const webhook = this.provider.parseWebhook(signature, payload);
    const payment = await this.repository.findByProviderOrderId(
      this.provider.name,
      webhook.providerOrderId,
    );
    if (!payment) {
      await this.repository.recordWebhook(
        this.provider.name,
        webhook.eventKey,
        webhook.raw,
      );
      return;
    }
    if (payment.amount.amount !== webhook.amount) {
      throw new ConflictException({
        code: 'PAYMENT_AMOUNT_MISMATCH',
        message: 'Provider payment amount does not match the order',
      });
    }
    if (webhook.status === 'processing') {
      payment.processing(webhook.providerPaymentId);
      await this.repository.save(payment);
      await this.recordWebhook(webhook.eventKey, webhook.raw);
      return;
    }
    if (webhook.status === 'failed') {
      payment.fail(webhook.statusCode);
      await this.repository.save(payment);
      await this.recordWebhook(webhook.eventKey, webhook.raw);
      return;
    }
    const changed = payment.succeed(
      webhook.providerPaymentId,
      webhook.paymentMethod,
      DateTimeValueObject.fromISOString(webhook.statusDate),
    );

    if (!changed) {

      return;
    }

    await Promise.all(
      [
        this.repository.save(payment),
        this.recordWebhook(webhook.eventKey, webhook.raw)
      ]
    )

    try {
      await this.publishSucceeded(payment);
    } catch (error) {
      this.logger.error(
        {
          err: error,
          paymentId: payment.id.toString(),
          eventKey: webhook.eventKey,
        },
        'Failed to publish payment success event',
      );
      //throw error;
    }

  }

  private async recordWebhook(
    eventKey: string,
    raw: Record<string, unknown>,
  ): Promise<void> {
    await this.repository.recordWebhook(this.provider.name, eventKey, raw);
  }

  private async publishSucceeded(payment: Payment): Promise<void> {
    await this.events.publishAsync(
      new PaymentSucceededDomainEvent(payment.id.toString(), {
        payableType: payment.payableType,
        payableId: payment.payableId,
        provider: this.provider.name,
        providerPaymentId: payment.providerPaymentId!,
        amount: {
          amount: payment.amount.amount,
          currency: CurrencyCode.RUB,
        },
        paidAt: payment.paidAt!.toISOString(),
      }),
    );
  }

  private expiration(subjectExpiresAt: string | null): Date {
    const standard = new Date(Date.now() + PAYMENT_TTL_MS);
    if (!subjectExpiresAt) return standard;
    const providerExpiry = new Date(
      new Date(subjectExpiresAt).getTime() - FLIGHT_EXPIRY_BUFFER_MS,
    );
    if (providerExpiry.getTime() <= Date.now()) {
      throw new ConflictException({
        code: 'PAYMENT_SUBJECT_EXPIRED',
        message: 'The order expires too soon to start payment',
      });
    }
    return providerExpiry < standard ? providerExpiry : standard;
  }

  private notFound(): never {
    throw new NotFoundException({
      code: 'PAYMENT_NOT_FOUND',
      message: 'Payment or payable order not found',
    });
  }
}
