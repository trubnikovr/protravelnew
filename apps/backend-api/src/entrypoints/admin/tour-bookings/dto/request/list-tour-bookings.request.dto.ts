import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';
import { TourBookingStatus } from '@modules/order-tour';

export class ListTourBookingsRequestDto extends BaseListRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TourBookingStatus })
  @IsOptional()
  @IsEnum(TourBookingStatus)
  status?: TourBookingStatus;
}
