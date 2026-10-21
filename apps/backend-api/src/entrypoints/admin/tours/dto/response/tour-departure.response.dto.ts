import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MoneyResponseDto } from '@entrypoints/common/dto/response/money.response.dto';

export class TourDepartureResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ type: String, format: 'date' }) departureDate!: string;
  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  returnDate!: string | null;
  @ApiProperty({ format: 'uuid' }) departureCityId!: string;
  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  departureAirportId!: string | null;
  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  arrivalAirportId!: string | null;
  @ApiProperty({ type: MoneyResponseDto }) price!: MoneyResponseDto;
  @ApiPropertyOptional({ type: Number, nullable: true }) seatsTotal!:
    | number
    | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) seatsAvailable!:
    | number
    | null;
}
