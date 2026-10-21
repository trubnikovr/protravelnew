import {
  DomainEntity,
  type DomainEntityProperties,
} from '@shared/domain/entities';
import {
  DateTimeValueObject,
  EntityIdValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import {
  PaymentPayableType,
  PaymentStatus,
  type PaymentMethod,
} from './payment.types';

export interface PaymentProperties extends DomainEntityProperties {
  customerId: string;
  payableType: PaymentPayableType;
  payableId: string;
  idempotencyKey: string;
  status: PaymentStatus;
  amount: MoneyValueObject;
  provider: string;
  providerOrderId: string;
  providerPaymentId: string | null;
  paymentMethod: PaymentMethod | null;
  paymentUrl: string | null;
  expiresAt: DateTimeValueObject;
  paidAt: DateTimeValueObject | null;
  failureCode: string | null;
}

type NewPaymentProperties = Omit<
  PaymentProperties,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'providerOrderId'
  | 'providerPaymentId'
  | 'paymentMethod'
  | 'paymentUrl'
  | 'paidAt'
  | 'failureCode'
>;

export class Payment extends DomainEntity<PaymentProperties> {
  static create(properties: NewPaymentProperties): Payment {
    const now = DateTimeValueObject.now();
    const id = EntityIdValueObject.create();
    return new Payment({
      ...properties,
      id,
      createdAt: now,
      updatedAt: now,
      status: PaymentStatus.CREATING,
      providerOrderId: id.toString(),
      providerPaymentId: null,
      paymentMethod: null,
      paymentUrl: null,
      paidAt: null,
      failureCode: null,
    });
  }

  static restore(properties: PaymentProperties): Payment {
    return new Payment(properties);
  }

  ready(paymentUrl: string): void {
    if (this.status !== PaymentStatus.CREATING) return;
    this.entityProperties.status = PaymentStatus.PENDING;
    this.entityProperties.paymentUrl = paymentUrl;
    this.touch();
  }

  processing(providerPaymentId: string | null): void {
    if (this.status === PaymentStatus.SUCCEEDED) return;
    this.entityProperties.status = PaymentStatus.PROCESSING;
    this.entityProperties.providerPaymentId = providerPaymentId;
    this.touch();
  }

  succeed(
    providerPaymentId: string,
    paymentMethod: PaymentMethod,
    paidAt: DateTimeValueObject,
  ): boolean {
    if (this.status === PaymentStatus.SUCCEEDED) return false;
    this.entityProperties.status = PaymentStatus.SUCCEEDED;
    this.entityProperties.providerPaymentId = providerPaymentId;
    this.entityProperties.paymentMethod = paymentMethod;
    this.entityProperties.paidAt = paidAt;
    this.entityProperties.failureCode = null;
    this.touch();
    return true;
  }

  fail(code: string): void {
    if (this.status === PaymentStatus.SUCCEEDED) return;
    this.entityProperties.status = PaymentStatus.FAILED;
    this.entityProperties.failureCode = code;
    this.touch();
  }

  get customerId() {
    return this.entityProperties.customerId;
  }
  get payableType() {
    return this.entityProperties.payableType;
  }
  get payableId() {
    return this.entityProperties.payableId;
  }
  get idempotencyKey() {
    return this.entityProperties.idempotencyKey;
  }
  get status() {
    return this.entityProperties.status;
  }
  get amount() {
    return this.entityProperties.amount;
  }
  get provider() {
    return this.entityProperties.provider;
  }
  get providerOrderId() {
    return this.entityProperties.providerOrderId;
  }
  get providerPaymentId() {
    return this.entityProperties.providerPaymentId;
  }
  get paymentMethod() {
    return this.entityProperties.paymentMethod;
  }
  get paymentUrl() {
    return this.entityProperties.paymentUrl;
  }
  get expiresAt() {
    return this.entityProperties.expiresAt;
  }
  get paidAt() {
    return this.entityProperties.paidAt;
  }
  get failureCode() {
    return this.entityProperties.failureCode;
  }

  private touch(): void {
    this.entityProperties.updatedAt = DateTimeValueObject.now();
  }
}
