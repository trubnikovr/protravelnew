import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateFlightOrderRequestDto,
  FlightOrderResponseDto,
} from '../../../shared/api/generated/v1/models';
import {
  CreateFlightOrderRequestDtoToJSON,
  FlightOrderResponseDtoFromJSON,
} from '../../../shared/api/generated/v1/models';

export async function createAndBookFlightOrder(
  input: CreateFlightOrderRequestDto,
  idempotencyKey: string,
): Promise<FlightOrderResponseDto> {
  return apiRequest<unknown>('/flight-orders/create-flight-order', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(CreateFlightOrderRequestDtoToJSON(input)),
  }).then(FlightOrderResponseDtoFromJSON);
}
