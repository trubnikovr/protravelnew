import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { AdminPermission } from '@modules/admin';
import { TourType, ToursService } from '@modules/tours';
import type {
  TourDeparture,
  TourDestination,
  TourExcursionDetails,
  TourPackageDetails,
  TourUpdateData,
  TourWriteData,
} from '@modules/tours';
import {
  ImageValueObject,
  LocalDateValueObject,
  MoneyValueObject,
} from '@shared/domain/value-objects';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CreateTourRequestDto } from './dto/request/create-tour.request.dto';
import { ListToursRequestDto } from './dto/request/list-tours.request.dto';
import type { TourDepartureRequestDto } from './dto/request/tour-departure.request.dto';
import type { TourDestinationRequestDto } from './dto/request/tour-destination.request.dto';
import { UpdateTourRequestDto } from './dto/request/update-tour.request.dto';
import { TourResponseDto } from './dto/response/tour.response.dto';
import { TourApiMapper } from './tour-api.mapper';

@ApiTags('admin/tours')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/tours')
export class AdminToursController {
  constructor(private readonly tours: ToursService) {}

  /** @see GET /api/v1/admin/tours */
  @Get()
  @RequirePermissions(AdminPermission.TOURS_READ)
  @ApiOperation({ summary: 'List tours for administration' })
  @ApiPaginatedEnvelope(TourResponseDto)
  async list(
    @Query() query: ListToursRequestDto,
  ): Promise<PaginatedResult<TourResponseDto>> {
    const result = await this.tours.list(query);
    return new PaginatedResult(
      result.items.map((tour) => TourApiMapper.toResponse(tour)),
      {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    );
  }

  /** @see GET /api/v1/admin/tours/:id */
  @Get(':id')
  @RequirePermissions(AdminPermission.TOURS_READ)
  @ApiOperation({ summary: 'Get an administrative tour' })
  @ApiOkEnvelope(TourResponseDto)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<TourResponseDto> {
    const tour = await this.tours.findById(id);
    if (!tour) this.notFound();
    return TourApiMapper.toResponse(tour);
  }

  /** @see POST /api/v1/admin/tours */
  @Post()
  @RequirePermissions(AdminPermission.TOURS_WRITE)
  @ApiOperation({ summary: 'Create a typed tour with route and departures' })
  @ApiEnvelope(TourResponseDto, HttpStatus.CREATED)
  async create(@Body() dto: CreateTourRequestDto): Promise<TourResponseDto> {
    return TourApiMapper.toResponse(
      await this.tours.create(this.mapCreate(dto)),
    );
  }

  /** @see PATCH /api/v1/admin/tours/:id */
  @Patch(':id')
  @RequirePermissions(AdminPermission.TOURS_WRITE)
  @ApiOperation({ summary: 'Update a typed tour' })
  @ApiOkEnvelope(TourResponseDto)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTourRequestDto,
  ): Promise<TourResponseDto> {
    const tour = await this.tours.update(id, this.mapUpdate(dto));
    if (!tour) this.notFound();
    return TourApiMapper.toResponse(tour);
  }

  /** @see DELETE /api/v1/admin/tours/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.TOURS_WRITE)
  @ApiOperation({ summary: 'Delete a tour and all related records' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    if (!(await this.tours.delete(id))) this.notFound();
  }

  private mapCreate(dto: CreateTourRequestDto): TourWriteData {
    return {
      slug: dto.slug,
      status: dto.status,
      type: dto.type,
      minTravelers: dto.minTravelers === undefined ? 1 : dto.minTravelers,
      maxTravelers: dto.maxTravelers === undefined ? 2 : dto.maxTravelers,
      durationDays: dto.durationDays,
      durationNights: dto.durationNights,
      price: MoneyValueObject.create(dto.price.amount, dto.price.currency),
      coverImage: dto.coverImage
        ? ImageValueObject.create(dto.coverImage.url)
        : null,
      galleryImages: dto.galleryImages.map(({ url }) =>
        ImageValueObject.create(url),
      ),
      activeFrom: dto.activeFrom
        ? LocalDateValueObject.create(dto.activeFrom)
        : null,
      activeTo: dto.activeTo ? LocalDateValueObject.create(dto.activeTo) : null,
      destinations: dto.destinations.map(this.destination),
      departures: dto.departures.map(this.departure),
      packageDetails:
        dto.type === TourType.PACKAGE
          ? this.packageDetails(dto.packageDetails!)
          : null,
      excursionDetails:
        dto.type === TourType.EXCURSION
          ? this.excursionDetails(dto.excursionDetails!)
          : null,
      programDays: dto.type === TourType.EXCURSION ? dto.programDays : [],
      isFeatured: dto.isFeatured,
      sortOrder: dto.sortOrder,
      content: dto.content,
    };
  }

  private mapUpdate(dto: UpdateTourRequestDto): TourUpdateData {
    return {
      ...this.common(dto),
      ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.minTravelers !== undefined ? { minTravelers: dto.minTravelers } : {}),
      ...(dto.maxTravelers !== undefined ? { maxTravelers: dto.maxTravelers } : {}),
      ...(dto.durationDays !== undefined
        ? { durationDays: dto.durationDays }
        : {}),
      ...(dto.durationNights !== undefined
        ? { durationNights: dto.durationNights }
        : {}),
      ...(dto.price
        ? {
            price: MoneyValueObject.create(
              dto.price.amount,
              dto.price.currency,
            ),
          }
        : {}),
      ...(dto.destinations
        ? { destinations: dto.destinations.map(this.destination) }
        : {}),
      ...(dto.departures
        ? { departures: dto.departures.map(this.departure) }
        : {}),
      ...(dto.packageDetails !== undefined
        ? {
            packageDetails: dto.packageDetails
              ? this.packageDetails(dto.packageDetails)
              : null,
          }
        : {}),
      ...(dto.excursionDetails !== undefined
        ? {
            excursionDetails: dto.excursionDetails
              ? this.excursionDetails(dto.excursionDetails)
              : null,
          }
        : {}),
      ...(dto.programDays !== undefined
        ? { programDays: dto.programDays }
        : {}),
      ...(dto.content ? { content: dto.content } : {}),
    };
  }

  private common(dto: UpdateTourRequestDto) {
    return {
      ...(dto.coverImage !== undefined
        ? {
            coverImage: dto.coverImage
              ? ImageValueObject.create(dto.coverImage.url)
              : null,
          }
        : {}),
      ...(dto.galleryImages
        ? {
            galleryImages: dto.galleryImages.map(({ url }) =>
              ImageValueObject.create(url),
            ),
          }
        : {}),
      ...(dto.activeFrom !== undefined
        ? {
            activeFrom: dto.activeFrom
              ? LocalDateValueObject.create(dto.activeFrom)
              : null,
          }
        : {}),
      ...(dto.activeTo !== undefined
        ? {
            activeTo: dto.activeTo
              ? LocalDateValueObject.create(dto.activeTo)
              : null,
          }
        : {}),
      ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
      ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
    };
  }

  private destination = (
    item: TourDestinationRequestDto,
    index: number,
  ): TourDestination => ({
    position: index + 1,
    countryId: item.countryId,
    cityId: item.cityId ?? null,
    arrivalAirportId: item.arrivalAirportId ?? null,
    nights: item.nights ?? null,
  });

  private departure = (item: TourDepartureRequestDto): TourDeparture => ({
    departureDate: LocalDateValueObject.create(item.departureDate),
    returnDate: item.returnDate
      ? LocalDateValueObject.create(item.returnDate)
      : null,
    departureCityId: item.departureCityId,
    departureAirportId: item.departureAirportId ?? null,
    arrivalAirportId: item.arrivalAirportId ?? null,
    price: MoneyValueObject.create(item.price.amount, item.price.currency),
    seatsTotal: item.seatsTotal ?? null,
    seatsAvailable: item.seatsAvailable ?? null,
  });

  private packageDetails(
    item: NonNullable<CreateTourRequestDto['packageDetails']>,
  ): TourPackageDetails {
    return {
      ...item,
      hotelCategory: item.hotelCategory ?? null,
    };
  }

  private excursionDetails(
    item: NonNullable<CreateTourRequestDto['excursionDetails']>,
  ): TourExcursionDetails {
    return {
      ...item,
      groupSizeMax: item.groupSizeMax ?? null,
    };
  }

  private notFound(): never {
    throw new NotFoundException({
      code: 'TOUR_NOT_FOUND',
      message: 'Tour not found',
    });
  }
}
