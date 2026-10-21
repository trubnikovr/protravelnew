import type { PublicCustomer } from '@modules/customers';
import type { CustomerProfileResponseDto } from './dto/response/customer-profile.response.dto';

export class CustomerProfileApiMapper {
  static toResponse(customer: PublicCustomer): CustomerProfileResponseDto {
    return {
      ...customer,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };
  }
}
