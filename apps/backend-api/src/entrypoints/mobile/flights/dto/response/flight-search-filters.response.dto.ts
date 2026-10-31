import { ApiProperty } from '@nestjs/swagger';
import { FlightHighlightType } from '@modules/flights';

export class FlightPriceFilterResponseDto {
  @ApiProperty({ type: String, nullable: true, example: '1200000' })
  min!: string | null;
  @ApiProperty({ type: String, nullable: true, example: '6800000' })
  max!: string | null;
}

export class FlightStopsFilterOptionResponseDto {
  @ApiProperty({ example: 'Без пересадок' }) label!: string;
  @ApiProperty({ minimum: 0 }) value!: number;
  @ApiProperty({ minimum: 0 }) count!: number;
}

export class FlightAirlineFilterOptionResponseDto {
  @ApiProperty({ example: 'HY' }) code!: string;
  @ApiProperty({ example: 'Uzbekistan Airways' }) name!: string;
  @ApiProperty({ minimum: 0 }) count!: number;
}

export class FlightBaggageFilterResponseDto {
  @ApiProperty({ minimum: 0 }) included!: number;
  @ApiProperty({ minimum: 0 }) notIncluded!: number;
}

export class FlightDurationFilterResponseDto {
  @ApiProperty({ type: Number, nullable: true }) minMinutes!: number | null;
  @ApiProperty({ type: Number, nullable: true }) maxMinutes!: number | null;
}

export class FlightDepartureTimeFilterResponseDto {
  @ApiProperty({ type: String, nullable: true, example: '01:20' })
  min!: string | null;
  @ApiProperty({ type: String, nullable: true, example: '23:45' })
  max!: string | null;
}

export class FlightSearchFiltersResponseDto {
  @ApiProperty({ type: FlightPriceFilterResponseDto })
  price!: FlightPriceFilterResponseDto;
  @ApiProperty({ type: [FlightStopsFilterOptionResponseDto] })
  stops!: FlightStopsFilterOptionResponseDto[];
  @ApiProperty({ type: [FlightAirlineFilterOptionResponseDto] })
  airlines!: FlightAirlineFilterOptionResponseDto[];
  @ApiProperty({ type: FlightBaggageFilterResponseDto })
  baggage!: FlightBaggageFilterResponseDto;
  @ApiProperty({ type: FlightDurationFilterResponseDto })
  duration!: FlightDurationFilterResponseDto;
  @ApiProperty({ type: FlightDepartureTimeFilterResponseDto })
  departureTime!: FlightDepartureTimeFilterResponseDto;
}

export class FlightHighlightResponseDto {
  @ApiProperty({ format: 'uuid' }) offerId!: string;
  @ApiProperty({ enum: FlightHighlightType }) type!: FlightHighlightType;
  @ApiProperty({ example: 'Самый дешёвый' }) label!: string;
}

export class FlightSearchMetaResponseDto {
  @ApiProperty({ type: FlightSearchFiltersResponseDto })
  filters!: FlightSearchFiltersResponseDto;
  @ApiProperty({ type: [FlightHighlightResponseDto] })
  highlights!: FlightHighlightResponseDto[];
}
