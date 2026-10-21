import { DomainEvent } from '@core/events/domain-event';
import type {
  PaymentSucceededEventV1,
  PaymentSucceededPayloadV1,
} from '@shared/events';

export class PaymentSucceededDomainEvent
  extends DomainEvent<PaymentSucceededPayloadV1>
  implements PaymentSucceededEventV1
{
  readonly name = 'payment.succeeded.v1';
  readonly version = 1;
}
