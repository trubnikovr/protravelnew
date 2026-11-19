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
  Query,
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
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';
import { CurrentCustomer } from '@entrypoints/common/decorators/current-customer.decorator';
import {
  CustomerJwtAuthGuard,
  type AuthenticatedCustomer,
} from '@modules/customer-auth';
import {
  BookFlightOrderUseCase,
  CancelFlightOrderUseCase,
  CreateFlightOrderUseCase,
  type FlightOrder,
  GetFlightOrderUseCase,
  ListFlightOrdersUseCase,
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
    private readonly listOrders: ListFlightOrdersUseCase,
  ) {}

  /** @see GET /api/v1/flight-orders */
  @Get()
  @ApiOperation({ summary: 'List current customer flight orders' })
  @ApiPaginatedEnvelope(FlightOrderResponseDto)
  list(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Query() query: BaseListRequestDto,
  ): Promise<PaginatedResult<FlightOrderResponseDto>> {
    return this.listOrders
      .execute(customer.id, query.page, query.limit)
      .then((result) => this.toPaginatedResult(result.items, result.total, query));
  }

  private toPaginatedResult(
    items: FlightOrder[],
    total: number,
    query: BaseListRequestDto,
  ): PaginatedResult<FlightOrderResponseDto> {
    return new PaginatedResult(
      items.map((item) => FlightOrderApiMapper.toResponse(item)),
      {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    );
  }

  /** @see POST /api/v1/flight-orders/create-flight-order */
  @Post('create-flight-order')
  @ApiHeader({ name: 'Idempotency-Key', required: true })
  @ApiOperation({ summary: 'Book a flight and create the flight order' })
  @ApiEnvelope(FlightOrderResponseDto, HttpStatus.CREATED)
  async create(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Headers('idempotency-key') key: string | undefined,
    @Body() dto: CreateFlightOrderRequestDto,
  ): Promise<FlightOrderResponseDto> {
    const idempotencyKey = this.validateIdempotencyKey(key);
    const input = { customerId: customer.id, idempotencyKey, offerId: dto.offerId, travelers: dto.travelers };
    const order = await this.createOrder.execute(input);
    return FlightOrderApiMapper.toResponse(order);
  }

  /** @see POST /api/v1/flight-orders */
  @Post()
  @ApiHeader({ name: 'Idempotency-Key', required: true })
  @ApiOperation({ summary: 'Book a flight and create the flight order (legacy route)', deprecated: true })
  @ApiEnvelope(FlightOrderResponseDto, HttpStatus.CREATED)
  createLegacy(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Headers('idempotency-key') key: string | undefined,
    @Body() dto: CreateFlightOrderRequestDto,
  ): Promise<FlightOrderResponseDto> {
    return this.create(customer, key, dto);
  }

  /** @see GET /api/v1/flight-orders/:id */
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

  /** @see POST /api/v1/flight-orders/:id/book */
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

  /** @see POST /api/v1/flight-orders/:id/refresh */
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

  /** @see POST /api/v1/flight-orders/:id/cancel */
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
