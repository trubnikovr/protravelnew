import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ApiArrayEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { TravelFactsService } from '@modules/content';
import { TravelFactApiMapper } from '@entrypoints/common/travel-facts/travel-fact-api.mapper';
import { TravelFactResponseDto } from '@entrypoints/common/travel-facts/travel-fact.response.dto';
import { ListTravelFactsRequestDto } from './list-travel-facts.request.dto';

@ApiTags('travel-facts')
@Controller('travel-facts')
export class TravelFactsController {
  constructor(private readonly facts: TravelFactsService) {}

  /** @see GET /api/v1/travel-facts */
  @Get()
  @ApiOperation({ summary: 'Get published travel facts for rotation' })
  @ApiArrayEnvelope(TravelFactResponseDto)
  async list(
    @Query() query: ListTravelFactsRequestDto,
  ): Promise<TravelFactResponseDto[]> {
    const facts = await this.facts.randomPublishedMany(
      query.destinationCode,
      query.limit,
    );
    return facts.map((fact) => TravelFactApiMapper.toResponse(fact));
  }

  /** @see GET /api/v1/travel-facts/random */
  @Get('random')
  @ApiQuery({ name: 'destinationCode', required: false, example: 'PQC' })
  @ApiOperation({ summary: 'Get a random published travel fact' })
  @ApiOkEnvelope(TravelFactResponseDto)
  async random(@Query('destinationCode') destinationCode?: string) {
    const fact = await this.facts.randomPublished(destinationCode);
    return fact ? TravelFactApiMapper.toResponse(fact) : null;
  }
}
