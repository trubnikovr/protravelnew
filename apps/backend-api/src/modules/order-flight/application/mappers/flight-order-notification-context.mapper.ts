import type { FlightOrderNotificationContextContract } from '@shared/contracts';
import type { FlightOrder } from '../../domain/flight-order';

export class FlightOrderNotificationContextMapper {
  static toContract(
    order: FlightOrder,
  ): FlightOrderNotificationContextContract {
    return {
      orderId: order.id.toString(),
      customerId: order.customerId.toString(),
      contact: {
        email: order.contact.email,
        name: order.contact.name,
      },
    };
  }
}
