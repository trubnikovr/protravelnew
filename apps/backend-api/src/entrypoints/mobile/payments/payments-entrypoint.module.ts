import { Module } from '@nestjs/common';
import { CustomerAuthModule } from '@modules/customer-auth';
import { PaymentsModule } from '@modules/payments';
import { CustomerPaymentsController } from './customer-payments.controller';
import { RaiffeisenWebhookController } from './raiffeisen-webhook.controller';

@Module({
  imports: [CustomerAuthModule, PaymentsModule],
  controllers: [CustomerPaymentsController, RaiffeisenWebhookController],
})
export class PaymentsEntrypointModule {}
