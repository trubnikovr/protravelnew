import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateFlightOrderRequestDto,
  FlightOrderResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  CreateFlightOrderRequestDtoToJSON,
  FlightOrderResponseDtoFromJSON,
} from '../../../shared/api/generated/v1/models';

function idempotencyKey(): string {
  return `flight-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function createAndBookFlightOrder(
  input: CreateFlightOrderRequestDto,
): Promise<FlightOrderResponseDto> {
  const draft = await apiRequest<unknown>('/flight-orders', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey() },
    body: JSON.stringify(CreateFlightOrderRequestDtoToJSON(input)),
  }).then(FlightOrderResponseDtoFromJSON);
  return apiRequest<unknown>(`/flight-orders/${draft.id}/book`, {
    method: 'POST',
  }).then(FlightOrderResponseDtoFromJSON);
}
