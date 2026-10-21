import { Injectable } from '@nestjs/common';
import type { FlightBookingProviderPort } from '../../application/flight-booking-provider.port';
import { randomUUID } from 'node:crypto';
import type { FlightBookingResult } from '../../domain/flight-order.types';

@Injectable()
export class MockFlightBookingProvider implements FlightBookingProviderPort {
  book(): Promise<FlightBookingResult> {
    const token = `mock-booking-${randomUUID()}`;
    return Promise.resolve({
      providerBookingToken: token,
      recordLocator: token.slice(-6).toUpperCase(),
      expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
      providerStatus: 'NEW',
    });
  }
  refresh(providerBookingToken: string): Promise<FlightBookingResult> {
    return Promise.resolve({
      providerBookingToken,
      recordLocator: providerBookingToken.slice(-6).toUpperCase(),
      expiresAt: new Date(Date.now() + 25 * 60_000).toISOString(),
      providerStatus: 'NEW',
    });
  }
  cancel(providerBookingToken: string): Promise<FlightBookingResult> {
    return Promise.resolve({
      providerBookingToken,
      recordLocator: providerBookingToken.slice(-6).toUpperCase(),
      expiresAt: null,
      providerStatus: 'CANCELLED',
    });
  }
}
