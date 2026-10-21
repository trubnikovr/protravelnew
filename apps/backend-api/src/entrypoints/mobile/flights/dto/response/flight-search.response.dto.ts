import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FlightSearchStatus } from '@modules/flights';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class FlightSearchResponseDto extends EntityResponseDto {
  @ApiProperty({ enum: FlightSearchStatus }) status!: FlightSearchStatus;
  @ApiProperty({ minimum: 0, maximum: 100 }) progress!: number;
  @ApiProperty({ format: 'date-time' }) expiresAt!: string;
  @ApiProperty({ example: 1000 }) nextPollAfterMs!: number;
  @ApiPropertyOptional({ nullable: true }) errorCode!: string | null;
}
