import { Controller, Get, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import {
  ApiArrayEnvelope,
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { CurrentLocale } from '@entrypoints/common/decorators/current-locale.decorator';
import { ReferenceService } from '@core/submodules/reference';
import { SupportedLocale } from '@shared/domain/enums';
import { ListReferenceCountriesRequestDto } from './dto/request/list-reference-countries.request.dto';
import { ReferenceCountryResponseDto } from './dto/response/reference-country.response.dto';
import {
  ReferenceSuggestRequestDto,
  ReferenceSuggestionTypeDto,
} from './dto/request/reference-suggest.request.dto';
import { ReferenceSuggestionResponseDto } from './dto/response/reference-suggestion.response.dto';
import { FeaturedFlightLocationResponseDto } from '@entrypoints/common/reference/featured-flight-location.dto';

@ApiTags('reference')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly reference: ReferenceService) {}

  @Get('featured-flight-locations')
  @ApiOperation({ summary: 'List featured flight locations' })
  @ApiArrayEnvelope(FeaturedFlightLocationResponseDto)
  featuredFlightLocations(): Promise<FeaturedFlightLocationResponseDto[]> {
    return this.reference.listFeaturedFlightLocations();
  }

  @Get('suggest')
  @ApiOperation({ summary: 'Suggest countries, cities and airports' })
  @ApiArrayEnvelope(ReferenceSuggestionResponseDto)
  async suggest(
    @Query() query: ReferenceSuggestRequestDto,
  ): Promise<ReferenceSuggestionResponseDto[]> {
    const suggestions = await this.reference.suggest({
      query: query.q,
      types: query.types,
      countryId: query.countryId,
      limit: query.limit,
    });
    return suggestions.map((suggestion) => ({
      ...suggestion,
      type: suggestion.type as ReferenceSuggestionTypeDto,
    }));
  }

  @Get('countries')
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: SupportedLocale,
  })
  @ApiOperation({
    summary: 'List localized countries for citizenship selection',
  })
  @ApiPaginatedEnvelope(ReferenceCountryResponseDto)
  async countries(
    @CurrentLocale() locale: SupportedLocale,
    @Query() query: ListReferenceCountriesRequestDto,
  ): Promise<PaginatedResult<ReferenceCountryResponseDto>> {
    const result = await this.reference.listCountries({ ...query, locale });

    return new PaginatedResult(
      result.items.map((country) => ({
        id: country.id.toString(),
        code: country.isoCode,
        name: country.name(locale),
        createdAt: country.createdAt.toISOString(),
        updatedAt: country.updatedAt.toISOString(),
      })),
      {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    );
  }
}
