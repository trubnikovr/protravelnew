import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import {
  BookFlightOrderUseCase,
  CancelFlightOrderUseCase,
  CreateFlightOrderUseCase,
  GetFlightOrderUseCase,
  RefreshFlightOrderUseCase,
} from '@modules/order-flight';
import { CreateFlightOrderRequestDto } from './dto/request/create-flight-order.request.dto';
import { FlightOrderResponseDto } from './dto/response/flight-order.response.dto';
import { FlightOrderApiMapper } from './flight-order-api.mapper';

@ApiTags('flight-orders')
@ApiBearerAuth()
@UseGuards(CustomerJwtAuthGuard)
@Controller('flight-orders')
export class FlightOrdersController {
  constructor(
    private readonly createOrder: CreateFlightOrderUseCase,
    private readonly getOrder: GetFlightOrderUseCase,
    private readonly bookOrder: BookFlightOrderUseCase,
    private readonly refreshOrder: RefreshFlightOrderUseCase,
    private readonly cancelOrder: CancelFlightOrderUseCase,
  ) {}

  @Post()
  @ApiHeader({ name: 'Idempotency-Key', required: true })
  @ApiOperation({ summary: 'Create draft flight order from validated offer' })
  @ApiEnvelope(FlightOrderResponseDto, HttpStatus.CREATED)
  async create(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Headers('idempotency-key') key: string | undefined,
    @Body() dto: CreateFlightOrderRequestDto,
  ): Promise<FlightOrderResponseDto> {
    const idempotencyKey = this.validateIdempotencyKey(key);
    const input = { customerId: customer.id, idempotencyKey, ...dto };
    const order = await this.createOrder.execute(input);
    return FlightOrderApiMapper.toResponse(order);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get current customer flight order' })
  @ApiOkEnvelope(FlightOrderResponseDto)
  async get(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FlightOrderResponseDto> {
    return FlightOrderApiMapper.toResponse(
      await this.requireOrder(customer.id, id),
    );
  }

  @Post(':id/book')
  @ApiOperation({ summary: 'Create provider booking for a draft flight order' })
  @ApiOkEnvelope(FlightOrderResponseDto)
  async book(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FlightOrderResponseDto> {
    return FlightOrderApiMapper.toResponse(
      await this.bookOrder.execute(customer.id, id),
    );
  }

  @Post(':id/refresh')
  @ApiOperation({ summary: 'Refresh provider booking status' })
  @ApiOkEnvelope(FlightOrderResponseDto)
  async refresh(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FlightOrderResponseDto> {
    return FlightOrderApiMapper.toResponse(
      await this.refreshOrder.execute(customer.id, id),
    );
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booked flight order' })
  @ApiOkEnvelope(FlightOrderResponseDto)
  async cancel(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FlightOrderResponseDto> {
    return FlightOrderApiMapper.toResponse(
      await this.cancelOrder.execute(customer.id, id),
    );
  }

  private async requireOrder(customerId: string, id: string) {
    const order = await this.getOrder.execute(customerId, id);
    if (!order) this.orderNotFound();
    return order;
  }

  private validateIdempotencyKey(key?: string): string {
    if (key && key.length <= 128) return key;
    throw new BadRequestException({
      code: 'IDEMPOTENCY_KEY_REQUIRED',
      message: 'A valid Idempotency-Key header is required',
    });
  }

  private orderNotFound(): never {
    throw new NotFoundException({
      code: 'FLIGHT_ORDER_NOT_FOUND',
      message: 'Flight order not found',
    });
  }
}
