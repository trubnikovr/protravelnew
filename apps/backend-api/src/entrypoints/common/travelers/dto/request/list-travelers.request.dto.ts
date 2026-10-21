import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';

export enum TravelerSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
}

export class ListTravelersRequestDto extends BaseListRequestDto {
  @ApiPropertyOptional({
    enum: TravelerSortField,
    default: TravelerSortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(TravelerSortField)
  override sortBy = TravelerSortField.CREATED_AT;
}
