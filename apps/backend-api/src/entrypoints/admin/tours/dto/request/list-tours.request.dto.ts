import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TourStatus, TourType } from '@modules/tours';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';

export enum TourSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  SORT_ORDER = 'sortOrder',
  PRICE = 'price',
  DURATION_DAYS = 'durationDays',
}

export class ListToursRequestDto extends BaseListRequestDto {
  @ApiPropertyOptional({
    enum: TourSortField,
    default: TourSortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(TourSortField)
  override sortBy = TourSortField.CREATED_AT;

  @ApiPropertyOptional({ enum: TourStatus })
  @IsOptional()
  @IsEnum(TourStatus)
  status?: TourStatus;

  @ApiPropertyOptional({ enum: TourType })
  @IsOptional()
  @IsEnum(TourType)
  type?: TourType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
