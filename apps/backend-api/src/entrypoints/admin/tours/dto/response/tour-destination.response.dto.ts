import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TourDestinationResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() position!: number;
  @ApiProperty({ format: 'uuid' }) countryId!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) countryCode!:
    string | null;
  @ApiProperty() countryName!: string;
  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  cityId!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) cityName!:
    string | null;
  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  arrivalAirportId!: string | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) nights!: number | null;
}
