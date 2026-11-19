import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyCode } from '@shared/domain/enums';
import { FlightOrderStatus } from '@modules/order-flight';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class FlightOrderOfferSnapshotResponseDto {
  @ApiProperty() carrierCode!: string;
  @ApiProperty() carrierName!: string;
  @ApiProperty({
    type: 'array',
    items: { type: 'object', additionalProperties: true },
  })
  itineraries!: unknown[];
  @ApiProperty() totalAmount!: string;
  @ApiProperty({ enum: CurrencyCode }) currency!: CurrencyCode;
  @ApiProperty({ example: '25 000 руб.' }) formatted!: string;
  @ApiProperty({ format: 'date-time' }) offerExpiresAt!: string;
}
export class FlightOrderResponseDto extends EntityResponseDto {
  @ApiProperty({ enum: FlightOrderStatus }) status!: FlightOrderStatus;
  @ApiProperty() provider!: string;
  @ApiProperty({ type: FlightOrderOfferSnapshotResponseDto })
  offer!: FlightOrderOfferSnapshotResponseDto;
  @ApiPropertyOptional({ nullable: true }) recordLocator!: string | null;
  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  bookingExpiresAt!: string | null;
  @ApiPropertyOptional({ nullable: true }) providerStatus!: string | null;
  @ApiPropertyOptional({ nullable: true }) failureCode!: string | null;
}
