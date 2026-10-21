import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FlightCabinClass, FlightPassengerType } from '@modules/flights';

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
}
