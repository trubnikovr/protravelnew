import { Inject, Injectable } from '@nestjs/common';
import { eq, lt } from 'drizzle-orm';
import { DRIZZLE_DB } from '@core/database/database.constants';
import type { Database } from '@core/database/database.types';
import type { FlightOfferRepository } from '../../application/ports/flight-offer.repository';
import type { FlightOffer } from '../../domain';
import { FlightOfferPersistenceMapper } from './flight-offer-persistence.mapper';
import { flightOffers } from './flight-offer.schema';

@Injectable()
export class DrizzleFlightOfferRepository implements FlightOfferRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: Database) {}

  async save(offers: FlightOffer[]): Promise<void> {
    if (!offers.length) return;
    await this.database
      .insert(flightOffers)
      .values(
        offers.map((offer) => FlightOfferPersistenceMapper.toInsert(offer)),
      )
      .onConflictDoNothing({ target: flightOffers.id });
  }

  async findOffer(id: string): Promise<FlightOffer | null> {
    const [record] = await this.database
      .select()
      .from(flightOffers)
      .where(eq(flightOffers.id, id))
      .limit(1);
    return record ? FlightOfferPersistenceMapper.toDomain(record) : null;
  }

  async deleteExpired(now: Date): Promise<number> {
    const deleted = await this.database
      .delete(flightOffers)
      .where(lt(flightOffers.expiresAt, now))
      .returning({ id: flightOffers.id });
    return deleted.length;
  }
}
