import type { FlightOrder } from '@modules/order-flight';
import { FlightOrderResponseDto } from './dto/response/flight-order.response.dto';

export class FlightOrderApiMapper {
  static toResponse(order: FlightOrder): FlightOrderResponseDto {
    return {
      ...this.identity(order),
      ...this.booking(order),
      offer: this.publicOffer(order),
    };
  }

  private static identity(order: FlightOrder) {
    return {
      id: order.id.toString(),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      status: order.status,
      provider: order.provider,
    };
  }

  private static publicOffer(order: FlightOrder) {
    const {
      providerReference: _providerReference,
      passengers: _passengers,
      ...offer
    } = order.offerSnapshot;
    void _providerReference;
    void _passengers;
    return offer;
  }

  private static booking(order: FlightOrder) {
    return {
      recordLocator: order.recordLocator,
      bookingExpiresAt: order.bookingExpiresAt?.toISOString() ?? null,
      providerStatus: order.providerStatus,
      failureCode: order.failureCode,
    };
  }
}
