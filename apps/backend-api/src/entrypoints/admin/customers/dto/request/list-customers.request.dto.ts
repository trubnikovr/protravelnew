import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';
import { CustomerStatus } from '@modules/customers';

export enum CustomerSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
}

export class ListCustomersRequestDto extends BaseListRequestDto {
  @ApiPropertyOptional({
    enum: CustomerSortField,
    default: CustomerSortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(CustomerSortField)
  override sortBy = CustomerSortField.CREATED_AT;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CustomerStatus })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;
}
