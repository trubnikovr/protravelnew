import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import {
  ApiEnvelope,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';
import { CurrentCustomer } from '@entrypoints/common/decorators/current-customer.decorator';
import {
  CustomerJwtAuthGuard,
  type AuthenticatedCustomer,
} from '@modules/customer-auth';
import { TourBookingsService } from '@modules/order-tour';
import { CustomerTourBookingApiMapper } from './customer-tour-booking-api.mapper';
import { CreateCustomerTourBookingRequestDto } from './dto/customer-tour-booking.request.dto';
import { CustomerTourBookingResponseDto } from './dto/customer-tour-booking.response.dto';

@ApiTags('me/tour-bookings')
@ApiBearerAuth()
@UseGuards(CustomerJwtAuthGuard)
@Controller('me/tour-bookings')
export class CustomerTourBookingsController {
  constructor(private readonly bookings: TourBookingsService) {}

  /** @see GET /api/v1/me/tour-bookings */
  @Get()
  @ApiOperation({ summary: 'List current customer tour bookings' })
  @ApiPaginatedEnvelope(CustomerTourBookingResponseDto)
  async list(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Query() query: BaseListRequestDto,
  ): Promise<PaginatedResult<CustomerTourBookingResponseDto>> {
    const result = await this.bookings.listForCustomer(
      customer.id,
      query.page,
      query.limit,
    );
    return new PaginatedResult(
      result.items.map((booking) =>
        CustomerTourBookingApiMapper.toResponse(booking),
      ),
      {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    );
  }

  /** @see GET /api/v1/me/tour-bookings/:id */
  @Get(':id')
  @ApiOperation({ summary: 'Get own tour booking' })
  @ApiOkEnvelope(CustomerTourBookingResponseDto)
  async get(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CustomerTourBookingResponseDto> {
    return CustomerTourBookingApiMapper.toResponse(
      await this.bookings.getForCustomer(customer.id, id),
    );
  }

  /** @see POST /api/v1/me/tour-bookings */
  @Post()
  @ApiOperation({ summary: 'Create a tour booking request' })
  @ApiEnvelope(CustomerTourBookingResponseDto, HttpStatus.CREATED)
  async create(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Body() dto: CreateCustomerTourBookingRequestDto,
  ): Promise<CustomerTourBookingResponseDto> {
    return CustomerTourBookingApiMapper.toResponse(
      await this.bookings.create({
        customerId: customer.id,
        tourId: dto.tourId,
        travelerIds: dto.travelerIds,
        travelersCount: dto.travelerIds.length,
        departureDate: dto.departureDate ?? null,
        notes: dto.notes?.trim() || null,
      }),
    );
  }
}
