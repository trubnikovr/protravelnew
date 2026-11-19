import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from '@shared/domain/enums';

export class MoneyResponseDto {
  @ApiProperty({ example: '12500000' }) amount!: string;
  @ApiProperty({ enum: CurrencyCode }) currency!: CurrencyCode;
  @ApiProperty({ example: '125 000 руб.' }) formatted!: string;
}
