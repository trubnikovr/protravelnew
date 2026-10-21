import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsTimeZone,
  Length,
  Matches,
} from 'class-validator';
import { CurrencyCode, SupportedLocale } from '@shared/domain/enums';
import { CustomerStatus } from '@modules/customers';

export class CreateCustomerRequestDto {
  @ApiProperty({ example: '+79991234567' })
  @Matches(/^\+[1-9]\d{7,14}$/)
  phone!: string;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'email' })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty()
  @IsString()
  @Length(1, 80)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @Length(1, 80)
  lastName!: string;

  @ApiProperty({ enum: SupportedLocale })
  @IsEnum(SupportedLocale)
  locale!: SupportedLocale;

  @ApiProperty({ enum: CurrencyCode })
  @IsEnum(CurrencyCode)
  currency!: CurrencyCode;

  @ApiProperty({ example: 'Europe/Moscow' })
  @IsTimeZone()
  timeZone!: string;

  @ApiProperty({ enum: CustomerStatus })
  @IsEnum(CustomerStatus)
  status!: CustomerStatus;
}
