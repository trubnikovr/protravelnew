import {apiRequest} from '../../../shared/api/api-client';
import type {
  CustomerProfileResponseDto,
  UpdateCustomerProfileRequestDto,
} from '../../../shared/api/generated/v1/models';
import {
  CustomerProfileResponseDtoFromJSON,
  UpdateCustomerProfileRequestDtoToJSON,
} from '../../../shared/api/generated/v1/models';

export type CustomerProfile = CustomerProfileResponseDto;
export type ProfileCurrency = CustomerProfile['currency'];
export type UpdateCustomerProfile = UpdateCustomerProfileRequestDto;

export async function getCustomerProfile(): Promise<CustomerProfile> {
  const data = await apiRequest<unknown>('/users/me');
  return CustomerProfileResponseDtoFromJSON(data);
}

export function updateCustomerProfile(
  input: UpdateCustomerProfile,
): Promise<CustomerProfile> {
  return apiRequest<unknown>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(UpdateCustomerProfileRequestDtoToJSON(input)),
  }).then(CustomerProfileResponseDtoFromJSON);
}
