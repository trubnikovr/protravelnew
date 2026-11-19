import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyCode } from '@shared/domain/enums';
import { FlightCabinClass } from '@modules/flights';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class FlightLocationResponseDto {
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional({ nullable: true }) terminal!: string | null;
}
export class FlightSegmentResponseDto {
  @ApiProperty() carrierCode!: string;
  @ApiProperty() carrierName!: string;
  @ApiProperty() flightNumber!: string;
  @ApiProperty({ type: FlightLocationResponseDto })
  origin!: FlightLocationResponseDto;
  @ApiProperty({ type: FlightLocationResponseDto })
  destination!: FlightLocationResponseDto;
  @ApiProperty({ example: '2026-09-15T08:00:00' }) departureLocal!: string;
  @ApiProperty({ example: '2026-09-15T11:00:00' }) arrivalLocal!: string;
  @ApiProperty() durationMinutes!: number;
  @ApiProperty({ enum: FlightCabinClass }) cabinClass!: FlightCabinClass;
  @ApiPropertyOptional({ nullable: true }) bookingClass!: string | null;
  @ApiPropertyOptional({ nullable: true }) baggage!: string | null;
  @ApiProperty({ example: 'Без багажа' }) baggageLabel!: string;
}
export class FlightItineraryResponseDto {
  @ApiProperty() durationMinutes!: number;
  @ApiProperty({ example: 'Прямой' }) stopsLabel!: string;
  @ApiProperty({ type: [FlightSegmentResponseDto] })
  segments!: FlightSegmentResponseDto[];
}
export class FlightOfferResponseDto extends EntityResponseDto {
  @ApiProperty({ example: 'до 20 кг · 1 место багажа' }) baggageLabel!: string;
  @ApiProperty() provider!: string;
  @ApiProperty() validatingCarrierCode!: string;
  @ApiProperty() validatingCarrierName!: string;
  @ApiProperty({ type: [FlightItineraryResponseDto] })
  itineraries!: FlightItineraryResponseDto[];
  @ApiProperty({ example: '2500000' }) totalAmount!: string;
  @ApiProperty({ enum: CurrencyCode }) currency!: CurrencyCode;
  @ApiProperty({ example: '25 000 руб.' }) formatted!: string;
  @ApiProperty() electronicTicket!: boolean;
  @ApiProperty() requiresLatinNames!: boolean;
  @ApiProperty({ format: 'date-time' }) expiresAt!: string;
}
