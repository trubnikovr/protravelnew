import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { PaymentPayableType } from '@modules/payments';

export class CreatePaymentRequestDto {
  @ApiProperty({ enum: PaymentPayableType })
  @IsEnum(PaymentPayableType)
  payableType!: PaymentPayableType;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  payableId!: string;
}
