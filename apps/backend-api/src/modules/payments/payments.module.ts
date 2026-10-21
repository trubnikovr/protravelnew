import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsOrdersBridgeModule } from '@app/integrations/payments-orders/payments-orders-bridge.module';
import { PaymentsService } from './application/payments.service';
import { PAYMENT_PROVIDER } from './application/payment-provider.port';
import { PAYMENT_REPOSITORY } from './application/payment.repository';
import { DrizzlePaymentRepository } from './infrastructure/persistence/drizzle-payment.repository';
import { MockPaymentProvider } from './infrastructure/providers/mock-payment.provider';
import { RaiffeisenPaymentProvider } from './infrastructure/providers/raiffeisen-payment.provider';

@Module({
  imports: [PaymentsOrdersBridgeModule],
  providers: [
    PaymentsService,
    DrizzlePaymentRepository,
    MockPaymentProvider,
    RaiffeisenPaymentProvider,
    {
      provide: PAYMENT_REPOSITORY,
      useExisting: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_PROVIDER,
      inject: [ConfigService, MockPaymentProvider, RaiffeisenPaymentProvider],
      useFactory: (
        config: ConfigService,
        mock: MockPaymentProvider,
        raiffeisen: RaiffeisenPaymentProvider,
      ) =>
        config.get<string>('PAYMENT_PROVIDER') === 'raiffeisen'
          ? raiffeisen
          : mock,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
