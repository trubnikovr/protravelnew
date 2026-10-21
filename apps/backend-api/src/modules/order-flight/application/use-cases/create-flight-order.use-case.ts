import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import type { FlightOfferForOrderContract } from '@shared/contracts';
import { CurrencyCode } from '@shared/domain/enums';
import { EntityIdValueObject } from '@shared/domain/value-objects';
import { FlightOrder } from '../../domain/flight-order';
import type {
  FlightOrderContact,
  FlightOrderOfferSnapshot,
  FlightOrderTravelerSelection,
} from '../../domain/flight-order.types';
import { FlightOrderEventMapper } from '../mappers/flight-order-event.mapper';
import {
  FLIGHT_OFFER_READER,
  type FlightOfferReaderPort,
} from '../flight-offer-reader.port';
import {
  FLIGHT_ORDER_REPOSITORY,
  type FlightOrderRepository,
} from '../flight-order.repository';

export interface CreateFlightOrderInput {
  readonly customerId: string;
  readonly offerId: string;
  readonly idempotencyKey: string;
  readonly contact: FlightOrderContact;
  readonly travelers: FlightOrderTravelerSelection[];
}

@Injectable()
export class CreateFlightOrderUseCase {
  constructor(
    @Inject(FLIGHT_ORDER_REPOSITORY)
    private readonly orders: FlightOrderRepository,
    @Inject(FLIGHT_OFFER_READER)
    private readonly offers: FlightOfferReaderPort,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(input: CreateFlightOrderInput): Promise<FlightOrder> {
    const existing = await this.findExisting(input);
    if (existing) return existing;

    const offer = await this.getValidatedOffer(input);
    const order = this.createOrder(input, offer);
    const saved = await this.saveIdempotently(input, order);

    if (saved.created) this.publishCreated(saved.order);
    return saved.order;
  }

  private findExisting(
    input: CreateFlightOrderInput,
  ): Promise<FlightOrder | null> {
    return this.orders.findByIdempotencyKey(
      input.customerId,
      input.idempotencyKey,
    );
  }

  private async getValidatedOffer(
    input: CreateFlightOrderInput,
  ): Promise<FlightOfferForOrderContract> {
    const original = await this.requireOffer(input.offerId);
    const current = await this.offers.revalidate(input.offerId);

    if (!current) this.offerNotFound();
    this.ensureAvailable(current);
    this.ensurePriceUnchanged(original, current);
    this.ensurePassengersMatch(current, input.travelers);
    return current;
  }

  private async requireOffer(
    offerId: string,
  ): Promise<FlightOfferForOrderContract> {
    const offer = await this.offers.get(offerId);
    if (!offer) this.offerNotFound();
    return offer;
  }

  private ensureAvailable(offer: FlightOfferForOrderContract): void {
    if (new Date(offer.expiresAt).getTime() > Date.now()) return;
    throw new ConflictException({
      code: 'OFFER_EXPIRED',
      message: 'Flight offer has expired',
    });
  }

  private ensurePriceUnchanged(
    original: FlightOfferForOrderContract,
    current: FlightOfferForOrderContract,
  ): void {
    const unchanged =
      original.totalAmount === current.totalAmount &&
      original.currency === current.currency;
    if (unchanged) return;

    throw new ConflictException({
      code: 'PRICE_CHANGED',
      message: 'Flight offer price has changed',
      details: this.priceChangeDetails(current),
    });
  }

  private priceChangeDetails(offer: FlightOfferForOrderContract) {
    return {
      offerId: offer.id,
      totalAmount: offer.totalAmount,
      currency: offer.currency,
    };
  }

  private ensurePassengersMatch(
    offer: FlightOfferForOrderContract,
    travelers: FlightOrderTravelerSelection[],
  ): void {
    if (this.passengersMatch(offer, travelers)) return;
    throw new ConflictException({
      code: 'FLIGHT_ORDER_PASSENGERS_MISMATCH',
      message:
        'Order travelers do not match the searched passenger composition',
    });
  }

  private passengersMatch(
    offer: FlightOfferForOrderContract,
    travelers: FlightOrderTravelerSelection[],
  ): boolean {
    const selected = this.countPassengers(travelers);
    const expected = offer.passengers;
    const expectedTotal = expected.reduce((sum, group) => sum + group.count, 0);
    const countsMatch = expected.every(
      ({ type, count }) => selected.get(type) === count,
    );
    return countsMatch && travelers.length === expectedTotal;
  }

  private countPassengers(travelers: FlightOrderTravelerSelection[]) {
    const counts = new Map<string, number>();
    for (const traveler of travelers) {
      const count = counts.get(traveler.passengerType) ?? 0;
      counts.set(traveler.passengerType, count + 1);
    }
    return counts;
  }

  private createOrder(
    input: CreateFlightOrderInput,
    offer: FlightOfferForOrderContract,
  ): FlightOrder {
    return FlightOrder.create({
      customerId: EntityIdValueObject.fromString(input.customerId),
      offerId: EntityIdValueObject.fromString(input.offerId),
      idempotencyKey: input.idempotencyKey,
      provider: offer.provider,
      contact: input.contact,
      travelers: input.travelers,
      offerSnapshot: this.createOfferSnapshot(offer),
    });
  }

  private createOfferSnapshot(
    offer: FlightOfferForOrderContract,
  ): FlightOrderOfferSnapshot {
    return {
      carrierCode: offer.validatingCarrierCode,
      carrierName: offer.validatingCarrierName,
      itineraries: offer.itineraries,
      totalAmount: offer.totalAmount,
      currency: CurrencyCode[offer.currency],
      offerExpiresAt: offer.expiresAt,
      providerReference: offer.providerReference,
      passengers: offer.passengers,
    };
  }

  private async saveIdempotently(
    input: CreateFlightOrderInput,
    order: FlightOrder,
  ) {
    try {
      await this.orders.save(order);
      return { order, created: true };
    } catch (error) {
      const concurrent = await this.findExisting(input);
      if (concurrent) return { order: concurrent, created: false };
      throw error;
    }
  }

  private publishCreated(order: FlightOrder): void {
    this.events.publish(FlightOrderEventMapper.toCreated(order));
  }

  private offerNotFound(): never {
    throw new NotFoundException({
      code: 'FLIGHT_OFFER_NOT_FOUND',
      message: 'Flight offer not found',
    });
  }
}
