import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import {
  ApiEnvelope,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import {
  CreateFlightSearchUseCase,
  GetFlightFareRulesUseCase,
  GetFlightOfferUseCase,
  GetFlightSearchResultsUseCase,
  GetFlightSearchUseCase,
  RevalidateFlightOfferUseCase,
  type FlightOffer,
} from '@modules/flights';
import { SortDirection } from '@entrypoints/common/dto/request/base-list.request.dto';
import { CreateFlightSearchRequestDto } from './dto/request/create-flight-search.request.dto';
import {
  FlightOfferSortField,
  ListFlightOffersRequestDto,
} from './dto/request/list-flight-offers.request.dto';
import { FlightFareRulesResponseDto } from './dto/response/flight-fare-rules.response.dto';
import { FlightOfferResponseDto } from './dto/response/flight-offer.response.dto';
import { FlightSearchResponseDto } from './dto/response/flight-search.response.dto';
import { FlightApiMapper } from './flight-api.mapper';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  constructor(
    private readonly createSearch: CreateFlightSearchUseCase,
    private readonly getSearch: GetFlightSearchUseCase,
    private readonly getResults: GetFlightSearchResultsUseCase,
    private readonly getOffer: GetFlightOfferUseCase,
    private readonly revalidateOffer: RevalidateFlightOfferUseCase,
    private readonly getFareRules: GetFlightFareRulesUseCase,
  ) {}

  @Post('searches')
  @ApiOperation({ summary: 'Start an asynchronous flight search' })
  @ApiEnvelope(FlightSearchResponseDto, HttpStatus.CREATED)
  async create(
    @Body() dto: CreateFlightSearchRequestDto,
  ): Promise<FlightSearchResponseDto> {
    return FlightApiMapper.toSearchResponse(
      await this.createSearch.execute(dto),
    );
  }

  @Get('searches/:searchId')
  @ApiOperation({ summary: 'Get flight search status' })
  @ApiOkEnvelope(FlightSearchResponseDto)
  async status(
    @Param('searchId', ParseUUIDPipe) id: string,
  ): Promise<FlightSearchResponseDto> {
    const search = await this.getSearch.execute(id);
    if (!search)
      this.notFound('FLIGHT_SEARCH_NOT_FOUND', 'Flight search not found');
    return FlightApiMapper.toSearchResponse(search);
  }

  @Get('searches/:searchId/results')
  @ApiOperation({ summary: 'Get normalized flight search results' })
  @ApiPaginatedEnvelope(FlightOfferResponseDto)
  async results(
    @Param('searchId', ParseUUIDPipe) id: string,
    @Query() query: ListFlightOffersRequestDto,
  ): Promise<PaginatedResult<FlightOfferResponseDto>> {
    if (!(await this.getSearch.execute(id)))
      this.notFound('FLIGHT_SEARCH_NOT_FOUND', 'Flight search not found');
    const all = this.sortOffers(await this.getResults.execute(id), query);
    const start = (query.page - 1) * query.limit;
    return new PaginatedResult(
      all
        .slice(start, start + query.limit)
        .map((offer) => FlightApiMapper.toOfferResponse(offer)),
      {
        page: query.page,
        limit: query.limit,
        total: all.length,
        totalPages: Math.ceil(all.length / query.limit),
      },
    );
  }

  @Get('offers/:offerId')
  @ApiOperation({ summary: 'Get a normalized flight offer' })
  @ApiOkEnvelope(FlightOfferResponseDto)
  async offer(
    @Param('offerId', ParseUUIDPipe) id: string,
  ): Promise<FlightOfferResponseDto> {
    const offer = await this.getOffer.execute(id);
    if (!offer)
      this.notFound('FLIGHT_OFFER_NOT_FOUND', 'Flight offer not found');
    return FlightApiMapper.toOfferResponse(offer);
  }

  @Post('offers/:offerId/revalidate')
  @ApiOperation({ summary: 'Revalidate availability and price before booking' })
  @ApiOkEnvelope(FlightOfferResponseDto)
  async revalidate(
    @Param('offerId', ParseUUIDPipe) id: string,
  ): Promise<FlightOfferResponseDto> {
    const offer = await this.revalidateOffer.execute(id);
    if (!offer)
      this.notFound('FLIGHT_OFFER_NOT_FOUND', 'Flight offer not found');
    return FlightApiMapper.toOfferResponse(offer);
  }

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

  private sortOffers(
    offers: FlightOffer[],
    query: ListFlightOffersRequestDto,
  ): FlightOffer[] {
    const value = (offer: FlightOffer): number | string => {
      if (query.sortBy === FlightOfferSortField.PRICE)
        return Number(offer.data.totalAmount);
      if (query.sortBy === FlightOfferSortField.DURATION)
        return offer.data.itineraries.reduce(
          (sum, item) => sum + item.durationMinutes,
          0,
        );
      if (query.sortBy === FlightOfferSortField.DEPARTURE)
        return offer.data.itineraries[0]?.segments[0]?.departureLocal ?? '';
      return offer.createdAt.toISOString();
    };
    const direction = query.sortDirection === SortDirection.ASC ? 1 : -1;
    return [...offers].sort((left, right) => {
      const a = value(left);
      const b = value(right);
      return (a < b ? -1 : a > b ? 1 : 0) * direction;
    });
  }
}
