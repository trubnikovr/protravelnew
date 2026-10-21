import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';

export class CreateTourBookingRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  customerId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  tourId!: string;

  @ApiProperty({ type: Number, minimum: 1, maximum: 100, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  travelersCount = 1;

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @IsOptional()
  @IsLocalDate()
  departureDate?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;
}
