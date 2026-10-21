import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateCustomerTourBookingRequestDto,
  CustomerTourBookingResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  CreateCustomerTourBookingRequestDtoToJSON,
  CustomerTourBookingResponseDtoFromJSON,
} from '../../../shared/api/generated/v1/models';

export type CustomerTourBooking = CustomerTourBookingResponseDto;
export type CreateCustomerTourBooking = CreateCustomerTourBookingRequestDto;

export async function listCustomerTourBookings(): Promise<
  CustomerTourBooking[]
> {
  const data = await apiRequest<unknown[]>(
    '/me/tour-bookings?page=1&limit=100',
  );
  return data.map(CustomerTourBookingResponseDtoFromJSON);
}

export function createCustomerTourBooking(
  input: CreateCustomerTourBooking,
): Promise<CustomerTourBooking> {
  return apiRequest<unknown>('/me/tour-bookings', {
    method: 'POST',
    body: JSON.stringify(CreateCustomerTourBookingRequestDtoToJSON(input)),
  }).then(CustomerTourBookingResponseDtoFromJSON);
}
