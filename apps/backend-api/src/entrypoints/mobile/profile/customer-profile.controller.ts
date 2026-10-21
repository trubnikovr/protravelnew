import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '@core/http/swagger/api-envelope.decorator';
import {
  CustomerJwtAuthGuard,
  type AuthenticatedCustomer,
} from '@modules/customer-auth';
import { CustomersService } from '@modules/customers';
import { CurrentCustomer } from '@entrypoints/common/decorators/current-customer.decorator';
import { UpdateCustomerProfileRequestDto } from './dto/request/update-customer-profile.request.dto';
import { CustomerProfileResponseDto } from './dto/response/customer-profile.response.dto';
import { CustomerProfileApiMapper } from './customer-profile-api.mapper';

@ApiTags('customer/profile')
@ApiBearerAuth()
@UseGuards(CustomerJwtAuthGuard)
@Controller('users')
export class CustomerProfileController {
  constructor(private readonly customers: CustomersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current customer profile' })
  @ApiOkEnvelope(CustomerProfileResponseDto)
  async me(
    @CurrentCustomer() customer: AuthenticatedCustomer,
  ): Promise<CustomerProfileResponseDto> {
    const profile = this.customers.toPublic(
      await this.customers.findById(customer.id),
    );
    return CustomerProfileApiMapper.toResponse(profile);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current customer profile' })
  @ApiOkEnvelope(CustomerProfileResponseDto)
  async update(
    @CurrentCustomer() customer: AuthenticatedCustomer,
    @Body() dto: UpdateCustomerProfileRequestDto,
  ): Promise<CustomerProfileResponseDto> {
    const updated = await this.customers.updateProfile(customer.id, dto);
    return CustomerProfileApiMapper.toResponse(this.customers.toPublic(updated));
  }
}
