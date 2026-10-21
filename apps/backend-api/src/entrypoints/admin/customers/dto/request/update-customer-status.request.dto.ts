import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CustomerStatus } from '@modules/customers';

export class UpdateCustomerStatusRequestDto {
  @ApiProperty({ enum: CustomerStatus })
  @IsEnum(CustomerStatus)
  status!: CustomerStatus;
}
