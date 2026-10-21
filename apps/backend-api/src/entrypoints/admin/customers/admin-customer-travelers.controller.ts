import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { CustomerTravelersService } from '@modules/customers/submodules/customer-travelers';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CreateTravelerRequestDto } from '@entrypoints/common/travelers/dto/request/create-traveler.request.dto';
import { UpdateTravelerRequestDto } from '@entrypoints/common/travelers/dto/request/update-traveler.request.dto';
import { CreateTravelerDocumentRequestDto } from '@entrypoints/common/travelers/dto/request/create-traveler-document.request.dto';
import { UpdateTravelerDocumentRequestDto } from '@entrypoints/common/travelers/dto/request/update-traveler-document.request.dto';
import { ListTravelersRequestDto } from '@entrypoints/common/travelers/dto/request/list-travelers.request.dto';
import { TravelerResponseDto } from '@entrypoints/common/travelers/dto/response/traveler.response.dto';
import { TravelerApiMapper } from '@entrypoints/common/travelers/traveler-api.mapper';

@ApiTags('admin/customers/travelers')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/customers/:customerId/travelers')
export class AdminCustomerTravelersController {
  constructor(private readonly travelers: CustomerTravelersService) {}

  @Get()
  @RequirePermissions(AdminPermission.USERS_READ)
  @ApiOperation({
    summary: 'List customer and family travelers with masked documents',
  })
  @ApiPaginatedEnvelope(TravelerResponseDto)
  async list(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query() query: ListTravelersRequestDto,
  ): Promise<PaginatedResult<TravelerResponseDto>> {
    const result = await this.travelers.list(customerId, query);
    return new PaginatedResult(
      result.items.map((traveler) => TravelerApiMapper.toResponse(traveler)),
      {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    );
  }

  @Post()
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Add the customer or a related traveler' })
  @ApiEnvelope(TravelerResponseDto, HttpStatus.CREATED)
  async create(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: CreateTravelerRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.create(customerId, dto),
    );
  }

  @Patch(':travelerId')
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Update a customer traveler' })
  @ApiOkEnvelope(TravelerResponseDto)
  async update(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Body() dto: UpdateTravelerRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.update(customerId, travelerId, dto),
    );
  }

  @Delete(':travelerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Delete a traveler and their documents' })
  async delete(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
  ): Promise<void> {
    await this.travelers.delete(customerId, travelerId);
  }

  @Post(':travelerId/documents')
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Add an encrypted traveler document' })
  @ApiEnvelope(TravelerResponseDto, HttpStatus.CREATED)
  async addDocument(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Body() dto: CreateTravelerDocumentRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.addDocument(customerId, travelerId, dto),
    );
  }

  @Patch(':travelerId/documents/:documentId')
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Update an encrypted traveler document' })
  @ApiOkEnvelope(TravelerResponseDto)
  async updateDocument(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: UpdateTravelerDocumentRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.updateDocument(
        customerId,
        travelerId,
        documentId,
        dto,
      ),
    );
  }

  @Delete(':travelerId/documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Delete a traveler document' })
  async deleteDocument(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<void> {
    await this.travelers.deleteDocument(customerId, travelerId, documentId);
  }
}
