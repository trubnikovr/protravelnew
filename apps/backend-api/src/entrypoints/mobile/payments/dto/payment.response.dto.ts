import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';
import { MoneyResponseDto } from '@entrypoints/common/dto/response/money.response.dto';
import {
  PaymentPayableType,
  PaymentStatus,
  type PaymentMethod,
} from '@modules/payments';

export class PaymentResponseDto extends EntityResponseDto {
  @ApiProperty({ enum: PaymentPayableType })
  payableType!: PaymentPayableType;

  @ApiProperty({ format: 'uuid' })
  payableId!: string;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiProperty({ type: MoneyResponseDto })
  amount!: MoneyResponseDto;

  @ApiProperty({ example: 'raiffeisen' })
  provider!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  paymentUrl!: string | null;

  @ApiPropertyOptional({
    enum: ['SBP', 'ACQUIRING'],
    nullable: true,
  })
  paymentMethod!: PaymentMethod | null;

  @ApiProperty({ format: 'date-time' })
  expiresAt!: string;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  paidAt!: string | null;
}
