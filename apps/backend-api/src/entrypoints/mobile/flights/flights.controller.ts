import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import {
  ApiEnvelope,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { RawResponse } from '@core/http/decorators/raw-response.decorator';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import {
  CreateFlightShareUseCase,
  GetFlightShareUseCase,
  SearchFlightsUseCase,
  GetFlightFareRulesUseCase,
  GetFlightOfferUseCase,
} from '@modules/flights';
import { CreateFlightSearchRequestDto } from './dto/request/create-flight-search.request.dto';
import { FlightFareRulesResponseDto } from './dto/response/flight-fare-rules.response.dto';
import { FlightOfferResponseDto } from './dto/response/flight-offer.response.dto';
import { FlightSearchMetaResponseDto } from './dto/response/flight-search-filters.response.dto';
import { FlightShareLinkResponseDto } from './dto/response/flight-share-link.response.dto';
import { FlightApiMapper } from './flight-api.mapper';
import {
  renderFlightSharePage,
  renderUnavailableFlightSharePage,
} from './flight-share-page.renderer';
import { SupportedLocale } from '@shared/domain/enums';
import { CurrentLocale } from '@entrypoints/common/decorators/current-locale.decorator';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  constructor(
    private readonly searchFlights: SearchFlightsUseCase,
    private readonly getOffer: GetFlightOfferUseCase,
    private readonly getFareRules: GetFlightFareRulesUseCase,
    private readonly createFlightShare: CreateFlightShareUseCase,
    private readonly getFlightShare: GetFlightShareUseCase,
    private readonly config: ConfigService,
  ) {}

  /** @see POST /api/v1/flights/search */
  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search flights and return normalized offers' })
  @ApiPaginatedEnvelope(FlightOfferResponseDto, FlightSearchMetaResponseDto)
  async search(
    @CurrentLocale() locale: SupportedLocale,
    @Body() dto: CreateFlightSearchRequestDto,
  ): Promise<PaginatedResult<FlightOfferResponseDto>> {
    const result = await this.searchFlights.execute(dto);
    return new PaginatedResult(
      result.items.map((offer) =>
        FlightApiMapper.toOfferResponse(offer, locale),
      ),
      {
        page: dto.page,
        limit: dto.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / dto.limit),
      },
      {
        filters: FlightApiMapper.toFiltersResponse(result.filters, locale),
        highlights: result.highlights.map((highlight) =>
          FlightApiMapper.toHighlightResponse(highlight, locale),
        ),
      },
    );
  }

  /** @see POST /api/v1/flights/searches */
  @Post('searches')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search flights (legacy route)', deprecated: true })
  @ApiPaginatedEnvelope(FlightOfferResponseDto, FlightSearchMetaResponseDto)
  searchLegacy(
    @CurrentLocale() locale: SupportedLocale,
    @Body() dto: CreateFlightSearchRequestDto,
  ): Promise<PaginatedResult<FlightOfferResponseDto>> {
    return this.search(locale, dto);
  }

  /** @see GET /api/v1/flights/offers/:offerId */
  @Get('offers/:offerId')
  @ApiOperation({ summary: 'Get a normalized flight offer' })
  @ApiOkEnvelope(FlightOfferResponseDto)
  async offer(
    @CurrentLocale() locale: SupportedLocale,
    @Param('offerId', ParseUUIDPipe) id: string,
  ): Promise<FlightOfferResponseDto> {
    const offer = await this.getOffer.execute(id);
    if (!offer)
      this.notFound('FLIGHT_OFFER_NOT_FOUND', 'Flight offer not found');
    return FlightApiMapper.toOfferResponse(offer, locale);
  }

  /** @see POST /api/v1/flights/offers/:offerId/share */
  @Post('offers/:offerId/share')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Create a public flight share link' })
  @ApiEnvelope(FlightShareLinkResponseDto, HttpStatus.CREATED)
  async share(
    @Param('offerId', ParseUUIDPipe) id: string,
  ): Promise<FlightShareLinkResponseDto> {
    const publicApiUrl = this.config
      .get<string>('PUBLIC_API_URL')
      ?.replace(/\/+$/, '');
    if (!publicApiUrl) {
      throw new InternalServerErrorException(
        'Public API URL is not configured',
      );
    }
    const apiPrefix = this.config
      .getOrThrow<string>('API_PREFIX')
      .replace(/^\/+|\/+$/g, '');
    const share = await this.createFlightShare.execute(id);
    if (!share) {
      this.notFound(
        'FLIGHT_OFFER_NOT_FOUND',
        'Flight offer not found or expired',
      );
    }

    return {
      url: `${publicApiUrl}/${apiPrefix}/v1/flights/shares/${share.token}`,
      expiresAt: share.expiresAt.toISOString(),
    };
  }

  /** @see GET /api/v1/flights/shares/:token */
  @Get('shares/:token')
  @RawResponse()
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'text/html; charset=utf-8')
  async sharedFlightPage(
    @Param('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    );
    const share = await this.getFlightShare.execute(token);
    if (!share) {
      response.status(HttpStatus.NOT_FOUND);
      return renderUnavailableFlightSharePage();
    }
    return renderFlightSharePage(share.snapshot);
  }

  /** @see GET /api/v1/flights/offers/:offerId/fare-rules */
  @Get('offers/:offerId/fare-rules')
  @ApiOperation({ summary: 'Get provider fare rules for a flight offer' })
  @ApiOkEnvelope(FlightFareRulesResponseDto)
  async fareRules(
    @Param('offerId', ParseUUIDPipe) id: string,
  ): Promise<FlightFareRulesResponseDto> {
    const rules = await this.getFareRules.execute(id);
    if (!rules)
      this.notFound('FLIGHT_OFFER_NOT_FOUND', 'Flight offer not found');
    return rules;
  }

  private notFound(code: string, message: string): never {
    throw new NotFoundException({ code, message });
  }
}
