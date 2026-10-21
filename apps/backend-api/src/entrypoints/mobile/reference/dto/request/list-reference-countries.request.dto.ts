import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';

export enum ReferenceCountrySortField {
  NAME = 'name',
  CODE = 'code',
}

export class ListReferenceCountriesRequestDto extends BaseListRequestDto {
  @ApiPropertyOptional({
    enum: ReferenceCountrySortField,
    default: ReferenceCountrySortField.NAME,
  })
  @IsEnum(ReferenceCountrySortField)
  override sortBy = ReferenceCountrySortField.NAME;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
