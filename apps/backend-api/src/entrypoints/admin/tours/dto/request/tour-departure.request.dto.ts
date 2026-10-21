import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';
import { MoneyRequestDto } from '@entrypoints/common/dto/request/money.request.dto';

export class TourDepartureRequestDto {
  @ApiProperty({ type: String, format: 'date' })
  @IsLocalDate()
  departureDate!: string;

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @IsOptional()
  @IsLocalDate()
  returnDate?: string | null;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  departureCityId!: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  departureAirportId?: string | null;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  arrivalAirportId?: string | null;

  @ApiProperty({ type: MoneyRequestDto })
  @ValidateNested()
  @Type(() => MoneyRequestDto)
  price!: MoneyRequestDto;

  @ApiPropertyOptional({ type: Number, minimum: 0, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  seatsTotal?: number | null;

  @ApiPropertyOptional({ type: Number, minimum: 0, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  seatsAvailable?: number | null;
}
