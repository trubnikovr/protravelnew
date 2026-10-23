import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsNumberString,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FlightCabinClass,
  FlightPassengerType,
  FlightSortBy,
} from '@modules/flights';

export class FlightRouteRequestDto {
  @ApiProperty({ example: 'MOW' }) @Matches(/^[A-Z]{3}$/) origin!: string;
  @ApiProperty({ example: 'IST' }) @Matches(/^[A-Z]{3}$/) destination!: string;
  @ApiProperty({ example: '2026-09-15', format: 'date' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  departureDate!: string;
}

export class FlightPassengerRequestDto {
  @ApiProperty({ enum: FlightPassengerType })
  @IsEnum(FlightPassengerType)
  type!: FlightPassengerType;
  @ApiProperty({ minimum: 1, maximum: 9 })
  @IsInt()
  @Min(1)
  @Max(9)
  count!: number;
}

export class CreateFlightSearchRequestDto {
  @ApiProperty({ type: [FlightRouteRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => FlightRouteRequestDto)
  routes!: FlightRouteRequestDto[];

  @ApiProperty({ type: [FlightPassengerRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => FlightPassengerRequestDto)
  passengers!: FlightPassengerRequestDto[];

  @ApiProperty({ enum: FlightCabinClass })
  @IsEnum(FlightCabinClass)
  cabinClass!: FlightCabinClass;
  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  directOnly = false;
  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  baggageRequired = false;
  @ApiPropertyOptional({ type: [String], example: ['HY'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredAirlines: string[] = [];

  @ApiPropertyOptional({ example: '06:00', pattern: '^\\d{2}:\\d{2}$' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  departureTimeFrom?: string;

  @ApiPropertyOptional({ example: '12:00', pattern: '^\\d{2}:\\d{2}$' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  departureTimeTo?: string;

  @ApiPropertyOptional({ example: '06:00', pattern: '^\\d{2}:\\d{2}$' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  arrivalTimeFrom?: string;

  @ApiPropertyOptional({ example: '23:00', pattern: '^\\d{2}:\\d{2}$' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  arrivalTimeTo?: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 4 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  maxStops?: number;

  @ApiPropertyOptional({ minimum: 1, example: 720 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxDurationMinutes?: number;

  @ApiPropertyOptional({ example: '1000000' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  minPrice?: string;

  @ApiPropertyOptional({ example: '5000000' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  maxPrice?: string;

  @ApiPropertyOptional({
    enum: FlightSortBy,
    default: FlightSortBy.RECOMMENDED,
  })
  @IsOptional()
  @IsEnum(FlightSortBy)
  sortBy: FlightSortBy = FlightSortBy.RECOMMENDED;
}
