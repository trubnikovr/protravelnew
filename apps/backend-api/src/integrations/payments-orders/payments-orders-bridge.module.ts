import { Module } from '@nestjs/common';
import { OrderFlightModule } from '@modules/order-flight';
import { OrderTourModule } from '@modules/order-tour';
import { PAYMENT_SUBJECT_READER } from '@modules/payments/application/payment-subject-reader.port';
import { PaymentSubjectReaderAdapter } from './payment-subject-reader.adapter';
import { PaymentSucceededHandlers } from './payment-succeeded.handlers';

@Module({
  imports: [OrderFlightModule, OrderTourModule],
  providers: [
    PaymentSubjectReaderAdapter,
    PaymentSucceededHandlers,
    {
      provide: PAYMENT_SUBJECT_READER,
      useExisting: PaymentSubjectReaderAdapter,
    },
  ],
  exports: [PAYMENT_SUBJECT_READER],
})
export class PaymentsOrdersBridgeModule {}
