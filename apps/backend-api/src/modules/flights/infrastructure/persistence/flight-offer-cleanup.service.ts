import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppLogger } from '@core/logging/app-logger';
import {
  FLIGHT_OFFER_REPOSITORY,
  type FlightOfferRepository,
} from '../../application/ports/flight-offer.repository';
import {
  FLIGHT_SHARE_REPOSITORY,
  type FlightShareRepository,
} from '../../application/ports/flight-share.repository';

@Injectable()
export class FlightOfferCleanupService {
  constructor(
    @Inject(FLIGHT_OFFER_REPOSITORY)
    private readonly offers: FlightOfferRepository,
    @Inject(FLIGHT_SHARE_REPOSITORY)
    private readonly shares: FlightShareRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FlightOfferCleanupService.name);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async removeExpired(): Promise<void> {
    const deletedOffers = await this.offers.deleteExpired(new Date());
    const deletedShares = await this.shares.deleteExpired(new Date());
    if (deletedOffers > 0 || deletedShares > 0) {
      this.logger.info(
        { deletedOffers, deletedShares },
        'Expired flight offers and share links removed',
      );
    }
  }
}
