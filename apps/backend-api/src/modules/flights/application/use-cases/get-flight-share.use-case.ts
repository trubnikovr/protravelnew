import { createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import {
  FLIGHT_SHARE_REPOSITORY,
  type FlightShareRepository,
} from '../ports/flight-share.repository';

@Injectable()
export class GetFlightShareUseCase {
  constructor(
    @Inject(FLIGHT_SHARE_REPOSITORY)
    private readonly shares: FlightShareRepository,
  ) {}

  execute(token: string) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return Promise.resolve(null);
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return this.shares.findActive(tokenHash, new Date());
  }
}
