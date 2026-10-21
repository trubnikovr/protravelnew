import { Module } from '@nestjs/common';
import { FlightsModule } from '@modules/flights';
import { FLIGHT_OFFER_READER } from '@modules/order-flight/application/flight-offer-reader.port';
import { FlightsModuleOfferReaderAdapter } from './flights-module-offer-reader.adapter';

@Module({
  imports: [FlightsModule],
  providers: [
    FlightsModuleOfferReaderAdapter,
    {
      provide: FLIGHT_OFFER_READER,
      useExisting: FlightsModuleOfferReaderAdapter,
    },
  ],
  exports: [FLIGHT_OFFER_READER],
})
export class FlightsOrderBridgeModule {}
