import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';
import { MoneyResponseDto } from '@entrypoints/common/dto/response/money.response.dto';
import { TourBookingStatus } from '@modules/order-tour';
import { TourBookingDocumentResponseDto } from './tour-booking-document.response.dto';

export class TourBookingTravelerResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  travelerId!: string | null;
  @ApiProperty() firstName!: string;
  @ApiProperty() lastName!: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  middleName!: string | null;
  @ApiProperty({ enum: ['male', 'female', 'unspecified'] })
  gender!: 'male' | 'female' | 'unspecified';
  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  birthDate!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  citizenshipCountryCode!: string | null;
}

export class TourBookingResponseDto extends EntityResponseDto {
  @ApiProperty() bookingNumber!: string;
  @ApiProperty({ format: 'uuid' }) customerId!: string;
  @ApiProperty() customerName!: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  customerPhone!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true, format: 'email' })
  customerEmail!: string | null;
  @ApiProperty({ format: 'uuid' }) tourId!: string;
  @ApiProperty() tourTitle!: string;
  @ApiProperty({ enum: TourBookingStatus }) status!: TourBookingStatus;
  @ApiProperty({ minimum: 1 }) travelersCount!: number;
  @ApiPropertyOptional({ type: String, nullable: true, format: 'date' })
  departureDate!: string | null;
  @ApiProperty({ type: MoneyResponseDto }) totalPrice!: MoneyResponseDto;
  @ApiPropertyOptional({ type: String, nullable: true }) notes!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  paidAt!: string | null;
  @ApiProperty({ type: [TourBookingDocumentResponseDto] })
  documents!: TourBookingDocumentResponseDto[];
  @ApiProperty({ type: [TourBookingTravelerResponseDto] })
  travelers!: TourBookingTravelerResponseDto[];
}
