import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { CurrentCustomer } from '@entrypoints/common/decorators/current-customer.decorator';
import {
  CustomerJwtAuthGuard,
  type AuthenticatedCustomer,
} from '@modules/customer-auth';
import { PaymentsService } from '@modules/payments';
import { CreatePaymentRequestDto } from './dto/create-payment.request.dto';
import { PaymentResponseDto } from './dto/payment.response.dto';
import { PaymentApiMapper } from './payment-api.mapper';

@ApiTags('me/payments')
@ApiBearerAuth()
@UseGuards(CustomerJwtAuthGuard)
@Controller('me/payments')
export class CustomerPaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  /** @see POST /api/v1/me/payments */
  @Post()
  @ApiHeader({ name: 'Idempotency-Key', required: true })
  @ApiOperation({ summary: 'Create hosted payment for an owned order' })
  @ApiEnvelope(PaymentResponseDto, HttpStatus.CREATED)
  async create(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Headers('idempotency-key') key: string | undefined,
    @Body() dto: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.payments.create({
      customerId: customer.id,
      payableType: dto.payableType,
      payableId: dto.payableId,
      idempotencyKey: this.validateIdempotencyKey(key),
      returnUrl: this.config.getOrThrow<string>('PAYMENT_RETURN_URL'),
    });
    return PaymentApiMapper.toResponse(payment);
  }

  /** @see GET /api/v1/me/payments/:id */
  @Get(':id')
  @ApiOperation({ summary: 'Get owned payment status' })
  @ApiOkEnvelope(PaymentResponseDto)
  async get(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PaymentResponseDto> {
    return PaymentApiMapper.toResponse(
      await this.payments.get(customer.id, id),
    );
  }

  private validateIdempotencyKey(key?: string): string {
    if (key && key.length <= 128) return key;
    throw new BadRequestException({
      code: 'IDEMPOTENCY_KEY_REQUIRED',
      message: 'A valid Idempotency-Key header is required',
    });
  }
}
