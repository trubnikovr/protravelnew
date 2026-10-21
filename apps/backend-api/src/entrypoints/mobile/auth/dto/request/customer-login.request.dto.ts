import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class CustomerLoginRequestDto {
  @ApiProperty({ example: '+79991234567' })
  @Matches(/^\+[1-9]\d{7,14}$/)
  phone!: string;
}
