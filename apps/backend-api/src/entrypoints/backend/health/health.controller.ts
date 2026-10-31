import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthScoreService } from '@core/health/health-score.service';
import {
  ApiEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import type { Response } from 'express';
import { HealthScoreResponseDto } from './dto/response/health-score.response.dto';
import { LivenessResponseDto } from './dto/response/liveness.response.dto';

@ApiTags('system/health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthScore: HealthScoreService) {}

  /** @see GET /api/v1/health */
  @Get()
  @ApiOperation({ summary: 'Get the overall weighted system health score' })
  @ApiOkEnvelope(HealthScoreResponseDto)
  @ApiEnvelope(HealthScoreResponseDto, 503)
  async score(
    @Res({ passthrough: true }) response: Response,
  ): Promise<HealthScoreResponseDto> {
    const result = await this.healthScore.calculate();
    if (result.status === 'unhealthy') {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return result;
  }

  /** @see GET /api/v1/health/live */
  @Get('live')
  @ApiOperation({ summary: 'Check whether the API process is alive' })
  @ApiOkEnvelope(LivenessResponseDto)
  live(): LivenessResponseDto {
    return { status: 'up' };
  }
}
