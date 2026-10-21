import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HealthComponentResponseDto {
  @ApiProperty({
    enum: ['application', 'database', 'redis', 'memory', 'eventLoop'],
  })
  key!: string;

  @ApiProperty({ enum: ['up', 'down', 'disabled'] })
  status!: 'up' | 'down' | 'disabled';

  @ApiProperty({ description: 'Whether failure reduces the overall score' })
  required!: boolean;

  @ApiProperty({ minimum: 0, maximum: 100 })
  weight!: number;

  @ApiProperty({ minimum: 0 })
  latencyMs!: number;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  details?: Record<string, string | number | boolean>;
}
