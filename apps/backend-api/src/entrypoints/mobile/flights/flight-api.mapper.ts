import { flightHighlightLabel, flightBaggageLabel, flightBaggageSummary, flightStopsLabel, type FlightHighlightType, type FlightOffer, type FlightSearchFilters } from '@modules/flights';
import type { CurrencyCode, SupportedLocale } from '@shared/domain/enums';
import { MoneyValueObject } from '@shared/domain/value-objects';
import { FlightOfferResponseDto } from './dto/response/flight-offer.response.dto';
import { FlightSearchFiltersResponseDto } from './dto/response/flight-search-filters.response.dto';
import { FlightHighlightResponseDto } from './dto/response/flight-search-filters.response.dto';

export class FlightApiMapper {
  static toFiltersResponse(filters: FlightSearchFilters, locale: SupportedLocale): FlightSearchFiltersResponseDto {
    return {
      ...filters,
      price: {
        ...filters.price,
        minFormatted: this.formatFilterPrice(filters.price.min, filters.price.currency, locale),
        maxFormatted: this.formatFilterPrice(filters.price.max, filters.price.currency, locale),
      },
      stops: filters.stops.map(option => ({
        ...option,
        label: flightStopsLabel(option.value, locale),
      })),
    };
  }

  private static formatFilterPrice(
    amount: string | null,
    currency: CurrencyCode | null,
    locale: SupportedLocale,
  ): string | null {
    return amount !== null && currency
      ? MoneyValueObject.create(amount, currency).formatWhole(locale)
      : null;
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
      formatted: MoneyValueObject.create(data.totalAmount, data.currency).formatWhole(locale),
      electronicTicket: data.electronicTicket,
      requiresLatinNames: data.requiresLatinNames,
      expiresAt: data.expiresAt,
    };
  }
}
