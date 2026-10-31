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
import { CurrentCustomer } from '@entrypoints/common/decorators/current-customer.decorator';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import {
  ApiEnvelope,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { CreateTravelerDocumentRequestDto } from '@entrypoints/common/travelers/dto/request/create-traveler-document.request.dto';
import { CreateTravelerRequestDto } from '@entrypoints/common/travelers/dto/request/create-traveler.request.dto';
import { ListTravelersRequestDto } from '@entrypoints/common/travelers/dto/request/list-travelers.request.dto';
import { UpdateTravelerDocumentRequestDto } from '@entrypoints/common/travelers/dto/request/update-traveler-document.request.dto';
import { UpdateTravelerRequestDto } from '@entrypoints/common/travelers/dto/request/update-traveler.request.dto';
import { TravelerResponseDto } from '@entrypoints/common/travelers/dto/response/traveler.response.dto';
import { TravelerApiMapper } from '@entrypoints/common/travelers/traveler-api.mapper';
import {
  CustomerJwtAuthGuard,
  type AuthenticatedCustomer,
} from '@modules/customer-auth';
import { CustomerTravelersService } from '@modules/customers/submodules/customer-travelers';

@ApiTags('me/travelers')
@ApiBearerAuth()
@UseGuards(CustomerJwtAuthGuard)
@Controller('me/travelers')
export class CustomerTravelersController {
  constructor(private readonly travelers: CustomerTravelersService) {}

  /** @see GET /api/v1/me/travelers */
  @Get()
  @ApiOperation({ summary: 'List current customer and family travelers' })
  @ApiPaginatedEnvelope(TravelerResponseDto)
  async list(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Query() query: ListTravelersRequestDto,
  ): Promise<PaginatedResult<TravelerResponseDto>> {
    const result = await this.travelers.list(customer.id, query);

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

  /** @see POST /api/v1/me/travelers */
  @Post()
  @ApiOperation({ summary: 'Add current customer or a family traveler' })
  @ApiEnvelope(TravelerResponseDto, HttpStatus.CREATED)
  async create(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Body() dto: CreateTravelerRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.create(customer.id, dto),
    );
  }

  /** @see PATCH /api/v1/me/travelers/:travelerId */
  @Patch(':travelerId')
  @ApiOperation({ summary: 'Update own traveler' })
  @ApiOkEnvelope(TravelerResponseDto)
  async update(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Body() dto: UpdateTravelerRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.update(customer.id, travelerId, dto),
    );
  }

  /** @see DELETE /api/v1/me/travelers/:travelerId */
  @Delete(':travelerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete own traveler and documents' })
  async delete(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
  ): Promise<void> {
    await this.travelers.delete(customer.id, travelerId);
  }

  /** @see POST /api/v1/me/travelers/:travelerId/documents */
  @Post(':travelerId/documents')
  @ApiOperation({ summary: 'Add encrypted document to own traveler' })
  @ApiEnvelope(TravelerResponseDto, HttpStatus.CREATED)
  async addDocument(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Body() dto: CreateTravelerDocumentRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.addDocument(customer.id, travelerId, dto),
    );
  }

  /** @see PATCH /api/v1/me/travelers/:travelerId/documents/:documentId */
  @Patch(':travelerId/documents/:documentId')
  @ApiOperation({ summary: 'Update encrypted own traveler document' })
  @ApiOkEnvelope(TravelerResponseDto)
  async updateDocument(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: UpdateTravelerDocumentRequestDto,
  ): Promise<TravelerResponseDto> {
    return TravelerApiMapper.toResponse(
      await this.travelers.updateDocument(
        customer.id,
        travelerId,
        documentId,
        dto,
      ),
    );
  }

  /** @see DELETE /api/v1/me/travelers/:travelerId/documents/:documentId */
  @Delete(':travelerId/documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete own traveler document' })
  async deleteDocument(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Param('travelerId', ParseUUIDPipe) travelerId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<void> {
    await this.travelers.deleteDocument(customer.id, travelerId, documentId);
  }
}
