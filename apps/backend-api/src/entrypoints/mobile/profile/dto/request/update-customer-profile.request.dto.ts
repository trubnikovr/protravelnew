import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsEmail,
  IsOptional,
  IsString,
  IsTimeZone,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { CurrencyCode, SupportedLocale } from '@shared/domain/enums';

export class UpdateCustomerProfileRequestDto {
  @ApiPropertyOptional({ example: 'Rustam' })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Trubnikov', type: String })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 80)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'Рустамович',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  middleName?: string | null;

  @ApiPropertyOptional({
    example: 'rustam@example.com',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string | null;

  @ApiPropertyOptional({ enum: SupportedLocale })
  @IsOptional()
  @IsEnum(SupportedLocale)
  locale?: SupportedLocale;

  @ApiPropertyOptional({ enum: CurrencyCode })
  @IsOptional()
  @IsEnum(CurrencyCode)
  currency?: CurrencyCode;

  @ApiPropertyOptional({ example: 'Europe/Moscow' })
  @IsOptional()
  @IsTimeZone()
  timeZone?: string;
}
