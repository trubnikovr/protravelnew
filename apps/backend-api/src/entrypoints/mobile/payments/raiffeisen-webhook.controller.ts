import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { PaymentsService } from '@modules/payments';

@ApiExcludeController()
@Controller('webhooks/payments/raiffeisen')
export class RaiffeisenWebhookController {
  constructor(private readonly payments: PaymentsService) {}

  /** @see POST /api/v1/webhooks/payments/raiffeisen */
  @Post()
  @HttpCode(200)
  async payment(
    @Headers('x-api-signature-sha256') signature: string,
    @Body() payload: Record<string, unknown>,
  ): Promise<{ accepted: true }> {
    await this.payments.handleRaiffeisenWebhook(signature, payload);
    return { accepted: true };
  }
}
