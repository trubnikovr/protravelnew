import {apiRequest} from '../../../shared/api/api-client';
import type {
  CreateTravelerRequestDto,
  CreateTravelerDocumentRequestDto,
  UpdateTravelerRequestDto,
  UpdateTravelerDocumentRequestDto,
  TravelerDocumentResponseDto,
  TravelerResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  CreateTravelerRequestDtoToJSON,
  CreateTravelerDocumentRequestDtoToJSON,
  UpdateTravelerDocumentRequestDtoToJSON,
  UpdateTravelerRequestDtoToJSON,
  TravelerResponseDtoFromJSON,
} from '../../../shared/api/generated/v1/models';

export type TravelerGender = TravelerResponseDto['gender'];
export type TravelerRelationship = TravelerResponseDto['relationship'];
export type TravelerDocument = TravelerDocumentResponseDto;
export type CustomerTraveler = TravelerResponseDto;
export type CreateCustomerTraveler = CreateTravelerRequestDto;

export async function listCustomerTravelers(): Promise<CustomerTraveler[]> {
  const data = await apiRequest<unknown[]>('/me/travelers?page=1&limit=100');
  return data.map(TravelerResponseDtoFromJSON);
}

export function createCustomerTraveler(
  input: CreateCustomerTraveler,
): Promise<CustomerTraveler> {
  return apiRequest<unknown>('/me/travelers', {
    method: 'POST',
    body: JSON.stringify(CreateTravelerRequestDtoToJSON(input)),
  }).then(TravelerResponseDtoFromJSON);
}

export function createCustomerTravelerDocument(
  travelerId: string,
  input: CreateTravelerDocumentRequestDto,
): Promise<CustomerTraveler> {
  return apiRequest<unknown>(`/me/travelers/${travelerId}/documents`, {
    method: 'POST',
    body: JSON.stringify(CreateTravelerDocumentRequestDtoToJSON(input)),
  }).then(TravelerResponseDtoFromJSON);
}

export function updateCustomerTravelerDocument(
  travelerId: string,
  documentId: string,
  input: UpdateTravelerDocumentRequestDto,
): Promise<CustomerTraveler> {
  return apiRequest<unknown>(`/me/travelers/${travelerId}/documents/${documentId}`, {
    method: 'PATCH',
    body: JSON.stringify(UpdateTravelerDocumentRequestDtoToJSON(input)),
  }).then(TravelerResponseDtoFromJSON);
}

export function deleteCustomerTravelerDocument(
  travelerId: string,
  documentId: string,
): Promise<void> {
  return apiRequest(`/me/travelers/${travelerId}/documents/${documentId}`, {
    method: 'DELETE',
  });
}

export function updateCustomerTraveler(
  travelerId: string,
  input: UpdateTravelerRequestDto,
): Promise<CustomerTraveler> {
  return apiRequest<unknown>(`/me/travelers/${travelerId}`, {
    method: 'PATCH',
    body: JSON.stringify(UpdateTravelerRequestDtoToJSON(input)),
  }).then(TravelerResponseDtoFromJSON);
}

export function deleteCustomerTraveler(id: string): Promise<void> {
  return apiRequest(`/me/travelers/${id}`, {method: 'DELETE'});
}
