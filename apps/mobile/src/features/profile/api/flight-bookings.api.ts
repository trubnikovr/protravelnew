import { apiRequest } from '../../../shared/api/api-client';
import type { FlightOrderResponseDto } from '../../../shared/api/generated/v1/models';
import { FlightOrderResponseDtoFromJSON } from '../../../shared/api/generated/v1/models';

export async function listCustomerFlightBookings(): Promise<FlightOrderResponseDto[]> {
  const data = await apiRequest<unknown[]>('/flight-orders?page=1&limit=100');
  return data.map(FlightOrderResponseDtoFromJSON);
}
