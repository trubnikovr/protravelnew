import { ApiProperty } from '@nestjs/swagger';
import { HealthComponentResponseDto } from './health-component.response.dto';

export class HealthScoreResponseDto {
  @ApiProperty({ enum: ['healthy', 'degraded', 'unhealthy'] })
  status!: 'healthy' | 'degraded' | 'unhealthy';

  @ApiProperty({ minimum: 0, maximum: 100, example: 100 })
  score!: number;

  @ApiProperty({ format: 'date-time' })
  checkedAt!: string;

  @ApiProperty({ minimum: 0 })
  uptimeSeconds!: number;

  @ApiProperty({ type: HealthComponentResponseDto, isArray: true })
  components!: HealthComponentResponseDto[];
}
