import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TourBookingStatus } from '@modules/order-tour';

export class UpdateTourBookingStatusRequestDto {
  @ApiProperty({ enum: TourBookingStatus })
  @IsEnum(TourBookingStatus)
  status!: TourBookingStatus;
}
