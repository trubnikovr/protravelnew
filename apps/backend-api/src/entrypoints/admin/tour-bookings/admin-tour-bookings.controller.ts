import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import {
  ApiEnvelope,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { AdminPermission } from '@modules/admin';
import { LocalDocumentStorageService } from '@core/submodules/files';
import { TourBookingsService } from '@modules/order-tour';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { AuthenticatedAdmin } from '../auth/admin-auth.types';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { CreateTourBookingRequestDto } from './dto/request/create-tour-booking.request.dto';
import { ListTourBookingsRequestDto } from './dto/request/list-tour-bookings.request.dto';
import { UpdateTourBookingStatusRequestDto } from './dto/request/update-tour-booking-status.request.dto';
import { TourBookingDocumentResponseDto } from './dto/response/tour-booking-document.response.dto';
import { TourBookingResponseDto } from './dto/response/tour-booking.response.dto';
import { TourBookingApiMapper } from './tour-booking-api.mapper';
import { BookingTravelerRequestDto } from './dto/request/booking-traveler.request.dto';

const documentFileType =
  /^(application\/(pdf|msword|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet))|image\/(jpeg|png|webp))$/;

@ApiTags('admin/tour-bookings')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/tour-bookings')
export class AdminTourBookingsController {
  constructor(
    private readonly bookings: TourBookingsService,
    private readonly documents: LocalDocumentStorageService,
  ) {}

  /** @see GET /api/v1/admin/tour-bookings */
  @Get()
  @RequirePermissions(AdminPermission.ORDERS_READ)
  @ApiOperation({ summary: 'List tour bookings' })
  @ApiPaginatedEnvelope(TourBookingResponseDto)
  async list(
    @Query() query: ListTourBookingsRequestDto,
  ): Promise<PaginatedResult<TourBookingResponseDto>> {
    const result = await this.bookings.list(query);
    return new PaginatedResult(
      result.items.map((booking) => TourBookingApiMapper.toResponse(booking)),
      {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    );
  }

  /** @see GET /api/v1/admin/tour-bookings/:id */
  @Get(':id')
  @RequirePermissions(AdminPermission.ORDERS_READ)
  @ApiOperation({ summary: 'Get a tour booking' })
  @ApiOkEnvelope(TourBookingResponseDto)
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TourBookingResponseDto> {
    return TourBookingApiMapper.toResponse(await this.bookings.get(id));
  }

  /** @see POST /api/v1/admin/tour-bookings */
  @Post()
  @RequirePermissions(AdminPermission.ORDERS_WRITE)
  @ApiOperation({ summary: 'Create a tour booking' })
  @ApiEnvelope(TourBookingResponseDto, HttpStatus.CREATED)
  async create(
    @Body() dto: CreateTourBookingRequestDto,
  ): Promise<TourBookingResponseDto> {
    return TourBookingApiMapper.toResponse(
      await this.bookings.create({
        customerId: dto.customerId,
        tourId: dto.tourId,
        travelersCount: dto.travelersCount,
        departureDate: dto.departureDate ?? null,
        notes: dto.notes?.trim() || null,
      }),
    );
  }

  /** @see PATCH /api/v1/admin/tour-bookings/:id/status */
  @Patch(':id/status')
  @RequirePermissions(AdminPermission.ORDERS_WRITE)
  @ApiOperation({ summary: 'Change tour booking status' })
  @ApiOkEnvelope(TourBookingResponseDto)
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTourBookingStatusRequestDto,
  ): Promise<TourBookingResponseDto> {
    return TourBookingApiMapper.toResponse(
      await this.bookings.changeStatus(id, dto.status),
    );
  }

  /** @see POST /api/v1/admin/tour-bookings/:id/travelers */
  @Post(':id/travelers')
  @RequirePermissions(AdminPermission.ORDERS_WRITE)
  @ApiOperation({ summary: 'Add traveler details to a booking' })
  @ApiEnvelope(TourBookingResponseDto, HttpStatus.CREATED)
  async addTraveler(@Param('id', ParseUUIDPipe) id: string, @Body() dto: BookingTravelerRequestDto): Promise<TourBookingResponseDto> {
    return TourBookingApiMapper.toResponse(await this.bookings.saveTraveler(id, null, this.travelerData(dto)));
  }

  /** @see PATCH /api/v1/admin/tour-bookings/:id/travelers/:travelerId */
  @Patch(':id/travelers/:travelerId')
  @RequirePermissions(AdminPermission.ORDERS_WRITE)
  @ApiOperation({ summary: 'Edit traveler details in a booking' })
  @ApiOkEnvelope(TourBookingResponseDto)
  async updateTraveler(@Param('id', ParseUUIDPipe) id: string, @Param('travelerId', ParseUUIDPipe) travelerId: string, @Body() dto: BookingTravelerRequestDto): Promise<TourBookingResponseDto> {
    return TourBookingApiMapper.toResponse(await this.bookings.saveTraveler(id, travelerId, this.travelerData(dto)));
  }

  private travelerData(dto: BookingTravelerRequestDto) {
    return { firstName: dto.firstName.trim(), lastName: dto.lastName.trim(), middleName: dto.middleName?.trim() || null, gender: dto.gender, birthDate: dto.birthDate ?? null, citizenshipCountryCode: dto.citizenshipCountryCode ?? null };
  }

  /** @see POST /api/v1/admin/tour-bookings/:id/documents */
  @Post(':id/documents')
  @RequirePermissions(AdminPermission.ORDERS_WRITE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a private document to a tour booking' })
  @ApiEnvelope(TourBookingDocumentResponseDto, HttpStatus.CREATED)
  async uploadDocument(
    @Param('id', ParseUUIDPipe) bookingId: string,
    @CurrentAdmin() admin: AuthenticatedAdmin,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 25 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: documentFileType }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<TourBookingDocumentResponseDto> {
    await this.bookings.get(bookingId);
    const stored = await this.documents.store(file);
    try {
      const document = await this.bookings.addDocument(bookingId, {
        originalName: file.originalname,
        storageKey: stored.storageKey,
        mimeType: stored.mimeType,
        size: stored.size,
        uploadedByAdminId: admin.id,
      });
      return TourBookingApiMapper.document(bookingId, document);
    } catch (error) {
      await this.documents.delete(stored.storageKey);
      throw error;
    }
  }

  /** @see GET /api/v1/admin/tour-bookings/:bookingId/documents/:documentId/download */
  @Get(':bookingId/documents/:documentId/download')
  @RequirePermissions(AdminPermission.ORDERS_READ)
  @ApiOperation({ summary: 'Download a private tour booking document' })
  @ApiProduces('application/octet-stream')
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  async downloadDocument(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<StreamableFile> {
    const document = await this.bookings.getDocument(bookingId, documentId);
    const content = await this.documents.read(document.storageKey);
    return new StreamableFile(content, {
      type: document.mimeType,
      disposition: `attachment; filename*=UTF-8''${encodeURIComponent(
        document.originalName,
      )}`,
      length: document.size,
    });
  }

  /** @see DELETE /api/v1/admin/tour-bookings/:bookingId/documents/:documentId */
  @Delete(':bookingId/documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.ORDERS_WRITE)
  @ApiOperation({ summary: 'Delete a tour booking document' })
  async deleteDocument(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<void> {
    const document = await this.bookings.deleteDocument(bookingId, documentId);
    await this.documents.delete(document.storageKey);
  }
}
