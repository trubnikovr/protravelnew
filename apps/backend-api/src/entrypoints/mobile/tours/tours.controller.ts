import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from '@core/http/contracts/api-response.contract';
import {
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { TourStatus, ToursService } from '@modules/tours';
import {
  ListPublicToursRequestDto,
  PublicTourSort,
} from './dto/request/list-public-tours.request.dto';
import {
  PublicTourListItemResponseDto,
  PublicTourResponseDto,
} from './dto/response/public-tour.response.dto';
import { PublicTourApiMapper } from './public-tour-api.mapper';

@ApiTags('tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly tours: ToursService) {}

  /** @see GET /api/v1/tours */
  @Get()
  @ApiOperation({ summary: 'List published tours for mobile catalog' })
  @ApiPaginatedEnvelope(PublicTourListItemResponseDto)
  async list(@Query() query: ListPublicToursRequestDto) {
    const result = await this.tours.list(this.filter(query));
    return new PaginatedResult(
      result.items.map(
        PublicTourApiMapper.toListItem.bind(PublicTourApiMapper),
      ),
      this.pagination(query, result.total),
    );
  }

  /** @see GET /api/v1/tours/:id */
  @Get(':id')
  @ApiOperation({ summary: 'Get a published tour with full customer content' })
  @ApiOkEnvelope(PublicTourResponseDto)
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PublicTourResponseDto> {
    const tour = await this.tours.findById(id);
    if (!tour || tour.status !== TourStatus.PUBLISHED)
      throw new NotFoundException();
    return PublicTourApiMapper.toResponse(tour);
  }

  private filter(query: ListPublicToursRequestDto) {
    return {
      page: query.page,
      limit: query.limit,
      status: TourStatus.PUBLISHED,
      destination: query.destination,
      sortBy:
        query.sort === PublicTourSort.PRICE
          ? ('price' as const)
          : ('sortOrder' as const),
      sortDirection: 'asc' as const,
    };
  }

  private pagination(query: ListPublicToursRequestDto, total: number) {
    return {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    };
  }
}
