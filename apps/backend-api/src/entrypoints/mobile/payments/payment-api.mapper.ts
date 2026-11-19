import type { Payment } from '@modules/payments';
import type { PaymentResponseDto } from './dto/payment.response.dto';

export class PaymentApiMapper {
  static toResponse(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id.toString(),
      payableType: payment.payableType,
      payableId: payment.payableId,
      status: payment.status,
      amount: {
        amount: payment.amount.amount,
        currency: payment.amount.currency,
        formatted: payment.amount.formatWhole(),
      },
      provider: payment.provider,
      paymentUrl: payment.paymentUrl,
      paymentMethod: payment.paymentMethod,
      expiresAt: payment.expiresAt.toISOString(),
      paidAt: payment.paidAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }
}
