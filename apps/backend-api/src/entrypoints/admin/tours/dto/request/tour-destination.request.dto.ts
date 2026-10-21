import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class TourDestinationRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  countryId!: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  cityId?: string | null;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  arrivalAirportId?: string | null;

  @ApiPropertyOptional({
    type: Number,
    minimum: 0,
    maximum: 365,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  nights?: number | null;
}
