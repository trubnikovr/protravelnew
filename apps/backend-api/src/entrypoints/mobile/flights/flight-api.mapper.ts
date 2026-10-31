import type { FlightHighlightType, FlightOffer, FlightSearchFilters } from '@modules/flights';
import type { SupportedLocale } from '@shared/domain/enums';
import { FlightOfferResponseDto } from './dto/response/flight-offer.response.dto';
import { FlightSearchFiltersResponseDto } from './dto/response/flight-search-filters.response.dto';
import { FlightHighlightResponseDto } from './dto/response/flight-search-filters.response.dto';
import { flightHighlightLabel } from './flight-highlight-label.catalog';
import { flightBaggageLabel, flightBaggageSummary } from './flight-baggage-label.catalog';
import { flightStopsLabel } from './flight-stops-label.catalog';

export class FlightApiMapper {
  static toFiltersResponse(filters: FlightSearchFilters, locale: SupportedLocale): FlightSearchFiltersResponseDto {
    return {
      ...filters,
      stops: filters.stops.map(option => ({
        ...option,
        label: flightStopsLabel(option.value, locale),
      })),
    };
  }

  static toHighlightResponse(
    highlight: { offerId: string; type: FlightHighlightType },
    locale: SupportedLocale,
  ): FlightHighlightResponseDto {
    return {
      ...highlight,
      label: flightHighlightLabel(highlight.type, locale),
    };
  }

  static toOfferResponse(
    offer: FlightOffer,
    locale: SupportedLocale,
  ): FlightOfferResponseDto {
    const data = offer.data;
    return {
      id: offer.id.toString(),
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
      provider: data.provider,
      validatingCarrierCode: data.validatingCarrierCode,
      validatingCarrierName: data.validatingCarrierName,
      baggageLabel: flightBaggageSummary(data.itineraries.flatMap(itinerary => itinerary.segments.map(segment => segment.baggage)), locale),
      itineraries: data.itineraries.map((itinerary) => ({
        ...itinerary,
        segments: itinerary.segments.map(segment => ({ ...segment, baggageLabel: flightBaggageLabel(segment.baggage, locale) })),
        stopsLabel: flightStopsLabel(itinerary.segments.length - 1, locale),
      })),
      totalAmount: data.totalAmount,
      currency: data.currency,
      electronicTicket: data.electronicTicket,
      requiresLatinNames: data.requiresLatinNames,
      expiresAt: data.expiresAt,
    };
  }
}
