import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsInt,
  IsString,
  IsUUID,
  MaxLength,
  Max,
  Min,
} from 'class-validator';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';

export class CreateCustomerTourBookingRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  tourId!: string;

  @ApiPropertyOptional({ type: String, isArray: true, format: 'uuid' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  travelerIds?: string[];

  @ApiPropertyOptional({ minimum: 1, maximum: 100, description: 'Required when no travelers are selected' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  travelersCount?: number;

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
