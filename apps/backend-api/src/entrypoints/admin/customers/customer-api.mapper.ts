import type { Customer } from '@modules/customers';
import type { CustomerResponseDto } from './dto/response/customer.response.dto';

export class CustomerApiMapper {
  static toResponse(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id.toString(),
      phone: customer.phone,
      email: customer.email?.toString() ?? null,
      firstName: customer.firstName,
      lastName: customer.lastName,
      locale: customer.locale,
      currency: customer.currency,
      timeZone: customer.timeZone.toString(),
      status: customer.status,
      createdAt: customer.createdAt.toString(),
      updatedAt: customer.updatedAt.toString(),
    };
  }
}
