import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DomainEventPublisher } from '@core/events/domain-event.publisher';
import { createHash } from 'node:crypto';
import { CustomerTravelersService } from '@modules/customers/submodules/customer-travelers';
import { GetCustomerForFlightBookingUseCase } from '@modules/customers';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { isEmail } from 'class-validator';
import { Temporal } from '@js-temporal/polyfill';
import {
  FLIGHT_BOOKING_PROVIDER,
  type FlightBookingProviderPort,
} from '../flight-booking-provider.port';
import { FlightOrderBookedDomainEvent } from '../../domain/flight-order.events';
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
import { AppLogger } from '@core/logging/app-logger';
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
    @Inject(FLIGHT_BOOKING_PROVIDER)
    private readonly provider: FlightBookingProviderPort,
    private readonly travelersService: CustomerTravelersService,
    private readonly customerProfiles: GetCustomerForFlightBookingUseCase,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CreateFlightOrderUseCase.name);
  }

  async execute(input: CreateFlightOrderInput): Promise<FlightOrder> {
    this.logger.info({ offerId: input.offerId }, 'Flight booking started');
    await this.step('check_idempotency', () => this.ensureMatchingAttempt(input));
    const existing = await this.step('find_existing_order', () => this.findExisting(input));
    if (existing) return this.existingOrder(existing);
    return this.createBooking(input);
  }

  private async createBooking(input: CreateFlightOrderInput): Promise<FlightOrder> {
    const offer = await this.step('validate_offer', () => this.getValidatedOffer(input));
    const passengers = await this.step('validate_travelers', () => this.travelersService.getBookingSnapshots(input.customerId, input.travelers));
    const contact = await this.step('validate_contact', () => this.profileContact(input.customerId));
    const order = this.createOrder(input, offer, contact);
    const orderId = order.id.toString();
    this.logger.info({ orderId, offerId: input.offerId, provider: order.provider }, 'Flight order prepared in memory');
    await this.step('reserve_attempt', () => this.reserveAttempt(input), orderId);
    // FLIGHT_PROVIDER=ttbooking: ../../infrastructure/providers/ttbooking-flight-booking.provider.ts
    // Иначе: ../../infrastructure/providers/mock-flight-booking.provider.ts (выбор в order-flight.module.ts).

    const booking = await this.step('provider_booking', () => this.provider.book(order.offerSnapshot, passengers, order.contact), orderId);
    order.confirm(booking);
    await this.step('save_order', () => this.orders.save(order), orderId);
    this.publishBooking(order);
    return order;
  }

  private publishBooking(order: FlightOrder): void {
    this.publishCreated(order);
    this.events.publish(new FlightOrderBookedDomainEvent(order.id.toString(), { recordLocator: order.recordLocator }));
    this.logger.info({ orderId: order.id.toString(), status: order.status }, 'Flight booking completed');
  }

  private existingOrder(order: FlightOrder): FlightOrder {
    this.logger.info(
      { orderId: order.id.toString(), status: order.status },
      'Existing flight order returned',
    );
    return order;
  }

  private async step<T>(stage: string, action: () => Promise<T>, orderId?: string): Promise<T> {
    const startedAt = performance.now();
    this.logger.info({ stage, orderId }, 'Flight booking step started');
    try {
      const result = await action();
      this.logger.info({ stage, orderId, durationMs: Math.round(performance.now() - startedAt) }, 'Flight booking step completed');
      return result;
    } catch (error) {
      this.logStepFailure(stage, orderId, startedAt, error);
      throw error;
    }
  }

  private logStepFailure(stage: string, orderId: string | undefined, startedAt: number, error: unknown): void {
    console.log({error})
    this.logger.error({ stage, orderId, durationMs: Math.round(performance.now() - startedAt), ...this.errorFields(error) }, 'Flight booking step failed');
  }

  private errorFields(error: unknown): Record<string, unknown> {
    if (!(error instanceof HttpException))
      return { errorType: error instanceof Error ? error.name : 'unknown' };
    const response = error.getResponse();
    const code =
      typeof response === 'object' &&
      'code' in response &&
      typeof response.code === 'string'
        ? response.code
        : undefined;
    return {
      statusCode: error.getStatus(),
      ...(code ? { errorCode: code } : {}),
    };
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
    const offer = await this.requireOffer(input.offerId);
    this.ensureAvailable(offer);
    this.ensurePassengersMatch(offer, input.travelers);
    return offer;
  }

  private async requireOffer(
    offerId: string,
  ): Promise<FlightOfferForOrderContract> {
    const offer = await this.offers.get(offerId);
    if (!offer) this.offerNotFound();
    return offer;
  }

  private ensureAvailable(offer: FlightOfferForOrderContract): void {
    if (Temporal.Instant.compare(Temporal.Instant.from(offer.expiresAt), Temporal.Now.instant()) > 0) return;
    throw new ConflictException({
      code: 'OFFER_EXPIRED',
      message: 'Flight offer has expired',
    });
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
    contact: FlightOrderContact,
  ): FlightOrder {
    return FlightOrder.create({
      customerId: EntityIdValueObject.fromString(input.customerId),
      offerId: EntityIdValueObject.fromString(input.offerId),
      idempotencyKey: input.idempotencyKey,
      provider: offer.provider,
      contact,
      travelers: input.travelers,
      offerSnapshot: this.createOfferSnapshot(offer),
    });
  }

  private async profileContact(customerId: string): Promise<FlightOrderContact> {
    const customer = await this.customerProfiles.execute(customerId);
    const email = customer?.email?.toString();
    if (!email || !isEmail(email)) throw new ConflictException({ code: 'FLIGHT_CONTACT_EMAIL_REQUIRED' });
    const number = parsePhoneNumberFromString(customer?.phone ?? '');
    if (!number?.isValid()) throw new ConflictException({ code: 'FLIGHT_CONTACT_PHONE_REQUIRED' });
    const areaLength = number.countryCallingCode === '7' ? 3 : number.countryCallingCode === '998' ? 2 : 0;
    return { name: [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || number.number, email, countryCode: number.countryCallingCode,
      areaCode: number.nationalNumber.slice(0, areaLength), phone: number.nationalNumber.slice(areaLength) };
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

  private async reserveAttempt(input: CreateFlightOrderInput): Promise<void> {
    const requestHash = this.requestHash(input);
    if (
      await this.orders.reserveBookingAttempt(
        input.customerId,
        input.idempotencyKey,
        requestHash,
      )
    )
      return;
    throw new ConflictException({
      code: 'FLIGHT_BOOKING_ALREADY_ATTEMPTED',
      message: 'Booking is in progress or needs verification',
    });
  }

  private async ensureMatchingAttempt(
    input: CreateFlightOrderInput,
  ): Promise<void> {
    const hash = await this.orders.bookingAttemptHash(
      input.customerId,
      input.idempotencyKey,
    );
    if (hash && hash !== this.requestHash(input)) {
      throw new ConflictException({
        code: 'IDEMPOTENCY_KEY_REUSED',
        message: 'Idempotency key was used for another request',
      });
    }
  }

  private requestHash(input: CreateFlightOrderInput): string {
    return createHash('sha256').update(JSON.stringify(input)).digest('hex');
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
