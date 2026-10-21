import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { CurrencyCode } from '@shared/domain/enums';

export class MoneyRequestDto {
  @ApiProperty({
    example: '12500000',
    description: 'Integer amount in minor units',
  })
  @IsString()
  @Matches(/^\d{1,18}$/)
  amount!: string;

  @ApiProperty({ enum: CurrencyCode })
  @IsEnum(CurrencyCode)
  currency!: CurrencyCode;
}
