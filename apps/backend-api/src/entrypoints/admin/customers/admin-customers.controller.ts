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
  Query,
  Post,
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
import { CustomersService } from '@modules/customers';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CustomerApiMapper } from './customer-api.mapper';
import { ListCustomersRequestDto } from './dto/request/list-customers.request.dto';
import { UpdateCustomerStatusRequestDto } from './dto/request/update-customer-status.request.dto';
import { CustomerResponseDto } from './dto/response/customer.response.dto';
import { CreateCustomerRequestDto } from './dto/request/create-customer.request.dto';
import { UpdateCustomerRequestDto } from './dto/request/update-customer.request.dto';

@ApiTags('admin/customers')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/customers')
export class AdminCustomersController {
  constructor(private readonly customers: CustomersService) {}

  /** @see POST /api/v1/admin/customers */
  @Post()
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Create a customer account' })
  @ApiEnvelope(CustomerResponseDto, HttpStatus.CREATED)
  async create(
    @Body() dto: CreateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return CustomerApiMapper.toResponse(
      await this.customers.createForAdmin(dto),
    );
  }

  /** @see GET /api/v1/admin/customers */
  @Get()
  @RequirePermissions(AdminPermission.USERS_READ)
  @ApiOperation({ summary: 'List customers' })
  @ApiPaginatedEnvelope(CustomerResponseDto)
  async list(
    @Query() query: ListCustomersRequestDto,
  ): Promise<PaginatedResult<CustomerResponseDto>> {
    const result = await this.customers.listForAdmin(query);
    return new PaginatedResult(
      result.items.map((customer) => CustomerApiMapper.toResponse(customer)),
      {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    );
  }

  /** @see GET /api/v1/admin/customers/:customerId */
  @Get(':customerId')
  @RequirePermissions(AdminPermission.USERS_READ)
  @ApiOperation({ summary: 'Get a customer' })
  @ApiOkEnvelope(CustomerResponseDto)
  async get(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<CustomerResponseDto> {
    return CustomerApiMapper.toResponse(
      this.customers.toDomain(await this.customers.findById(customerId)),
    );
  }

  /** @see PATCH /api/v1/admin/customers/:customerId/status */
  @Patch(':customerId/status')
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Block or activate a customer' })
  @ApiOkEnvelope(CustomerResponseDto)
  async updateStatus(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: UpdateCustomerStatusRequestDto,
  ): Promise<CustomerResponseDto> {
    return CustomerApiMapper.toResponse(
      await this.customers.updateStatus(customerId, dto.status),
    );
  }

  /** @see PATCH /api/v1/admin/customers/:customerId */
  @Patch(':customerId')
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Update a customer account' })
  @ApiOkEnvelope(CustomerResponseDto)
  async update(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: UpdateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return CustomerApiMapper.toResponse(
      await this.customers.updateForAdmin(customerId, dto),
    );
  }

  /** @see DELETE /api/v1/admin/customers/:customerId */
  @Delete(':customerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.USERS_WRITE)
  @ApiOperation({ summary: 'Delete a customer without order history' })
  async delete(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<void> {
    await this.customers.deleteForAdmin(customerId);
  }
}
