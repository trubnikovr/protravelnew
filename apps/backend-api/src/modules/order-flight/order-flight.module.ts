import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlightsOrderBridgeModule } from '@app/integrations/flights-order/flights-order-bridge.module';
import { CustomerTravelersModule } from '@modules/customers/submodules/customer-travelers';
import { FLIGHT_BOOKING_PROVIDER } from './application/flight-booking-provider.port';
import { FLIGHT_ORDER_REPOSITORY } from './application/flight-order.repository';
import { BookFlightOrderUseCase } from './application/use-cases/book-flight-order.use-case';
import { CancelFlightOrderUseCase } from './application/use-cases/cancel-flight-order.use-case';
import { CreateFlightOrderUseCase } from './application/use-cases/create-flight-order.use-case';
import { GetFlightOrderUseCase } from './application/use-cases/get-flight-order.use-case';
import { GetFlightOrderNotificationContextUseCase } from './application/use-cases/get-flight-order-notification-context.use-case';
import { RefreshFlightOrderUseCase } from './application/use-cases/refresh-flight-order.use-case';
import { GetFlightOrderForPaymentUseCase } from './application/use-cases/get-flight-order-for-payment.use-case';
import { UpdateFlightOrderPaymentStatusUseCase } from './application/use-cases/update-flight-order-payment-status.use-case';
import { DrizzleFlightOrderRepository } from './infrastructure/persistence/drizzle-flight-order.repository';
import { TtbookingFlightBookingProvider } from './infrastructure/providers/ttbooking-flight-booking.provider';
import { MockFlightBookingProvider } from './infrastructure/providers/mock-flight-booking.provider';
import { TtbookingErrorMapper } from '@app/integrations/ttbooking/ttbooking-error.mapper';

const useCases = [
  CreateFlightOrderUseCase,
  GetFlightOrderUseCase,
  GetFlightOrderNotificationContextUseCase,
  BookFlightOrderUseCase,
  RefreshFlightOrderUseCase,
  CancelFlightOrderUseCase,
  GetFlightOrderForPaymentUseCase,
  UpdateFlightOrderPaymentStatusUseCase,
];
@Module({
  imports: [FlightsOrderBridgeModule, CustomerTravelersModule],
  providers: [
    ...useCases,
    DrizzleFlightOrderRepository,
    MockFlightBookingProvider,
    TtbookingFlightBookingProvider,
    TtbookingErrorMapper,
    {
      provide: FLIGHT_ORDER_REPOSITORY,
      useExisting: DrizzleFlightOrderRepository,
    },
    {
      provide: FLIGHT_BOOKING_PROVIDER,
      inject: [
        ConfigService,
        MockFlightBookingProvider,
        TtbookingFlightBookingProvider,
      ],
      useFactory: (
        config: ConfigService,
        mock: MockFlightBookingProvider,
        ttbooking: TtbookingFlightBookingProvider,
      ) =>
        config.get<string>('FLIGHT_PROVIDER') === 'ttbooking'
          ? ttbooking
          : mock,
    },
  ],
  exports: useCases,
})
export class OrderFlightModule {}
