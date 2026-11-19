import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';

export class TourBookingPriceQuoteRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  tourId!: string;

  @ApiProperty({ minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  travelersCount!: number;

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @IsOptional()
  @IsLocalDate()
  departureDate?: string | null;
}
