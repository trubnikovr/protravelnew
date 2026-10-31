import type { FlightShareSnapshot } from '../../domain';

export const FLIGHT_SHARE_REPOSITORY = Symbol('FLIGHT_SHARE_REPOSITORY');

export interface FlightShareRepository {
  create(input: {
    tokenHash: string;
    snapshot: FlightShareSnapshot;
    expiresAt: Date;
  }): Promise<void>;
  findActive(
    tokenHash: string,
    now: Date,
  ): Promise<{ snapshot: FlightShareSnapshot; expiresAt: Date } | null>;
  deleteExpired(now: Date): Promise<number>;
}
