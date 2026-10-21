import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Matches } from 'class-validator';

export class VerifyCustomerLoginRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  verificationId!: string;

  @ApiProperty({ example: '4322' })
  @Matches(/^\d{4}$/)
  code!: string;
}
