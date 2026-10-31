import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, lt } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import type { FlightShareRepository } from '../../application/ports/flight-share.repository';
import { flightShares } from './flight-share.schema';

@Injectable()
export class DrizzleFlightShareRepository implements FlightShareRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async create(input: {
    tokenHash: string;
    snapshot: typeof flightShares.$inferInsert.snapshot;
    expiresAt: Date;
  }): Promise<void> {
    await this.database.insert(flightShares).values(input);
  }

  async findActive(tokenHash: string, now: Date) {
    const [record] = await this.database
      .select({
        snapshot: flightShares.snapshot,
        expiresAt: flightShares.expiresAt,
      })
      .from(flightShares)
      .where(
        and(
          eq(flightShares.tokenHash, tokenHash),
          gt(flightShares.expiresAt, now),
        ),
      )
      .limit(1);
    return record ?? null;
  }

  async deleteExpired(now: Date): Promise<number> {
    const deleted = await this.database
      .delete(flightShares)
      .where(lt(flightShares.expiresAt, now))
      .returning({ tokenHash: flightShares.tokenHash });
    return deleted.length;
  }
}
