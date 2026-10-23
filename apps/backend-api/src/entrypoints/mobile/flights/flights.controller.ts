import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiArrayEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import {
  SearchFlightsUseCase,
  GetFlightFareRulesUseCase,
  GetFlightOfferUseCase,
  RevalidateFlightOfferUseCase,
} from '@modules/flights';
import { CreateFlightSearchRequestDto } from './dto/request/create-flight-search.request.dto';
import { FlightFareRulesResponseDto } from './dto/response/flight-fare-rules.response.dto';
import { FlightOfferResponseDto } from './dto/response/flight-offer.response.dto';
import { FlightApiMapper } from './flight-api.mapper';
import { SupportedLocale } from '@shared/domain/enums';

@ApiTags('flights')
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  enum: SupportedLocale,
})
@Controller('flights')
export class FlightsController {
  constructor(
    private readonly searchFlights: SearchFlightsUseCase,
    private readonly getOffer: GetFlightOfferUseCase,
    private readonly revalidateOffer: RevalidateFlightOfferUseCase,
    private readonly getFareRules: GetFlightFareRulesUseCase,
  ) {}

  @Post('searches')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search flights and return normalized offers' })
  @ApiArrayEnvelope(FlightOfferResponseDto)
  async search(
    @Body() dto: CreateFlightSearchRequestDto,
  ): Promise<FlightOfferResponseDto[]> {
    const offers = await this.searchFlights.execute(dto);
    return offers.map((offer) => FlightApiMapper.toOfferResponse(offer));
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
}
