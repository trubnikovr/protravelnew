import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '@core/http/swagger/api-envelope.decorator';
import { HomeService } from '@modules/tours';
import { HomeResponseDto } from './dto/response/home.response.dto';
import { HomeApiMapper } from './home-api.mapper';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly home: HomeService) {}

  /** @see GET /api/v1/home */
  @Get()
  @ApiOperation({ summary: 'Get curated content for the mobile home screen' })
  @ApiOkEnvelope(HomeResponseDto)
  async get(): Promise<HomeResponseDto> {
    return HomeApiMapper.toResponse(await this.home.get());
  }
}
