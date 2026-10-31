import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyCode, SupportedLocale } from '@shared/domain/enums';
import { CustomerStatus } from '@modules/customers';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class CustomerResponseDto extends EntityResponseDto {
  @ApiPropertyOptional({ nullable: true, type: String }) phone!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'email' })
  email!: string | null;
  @ApiProperty() firstName!: string;
  @ApiPropertyOptional({ nullable: true, type: String }) lastName!:
    string | null;
  @ApiProperty({ enum: SupportedLocale }) locale!: SupportedLocale;
  @ApiProperty({ enum: CurrencyCode }) currency!: CurrencyCode;
  @ApiProperty({ example: 'Europe/Moscow' }) timeZone!: string;
  @ApiProperty({ enum: CustomerStatus }) status!: CustomerStatus;
}
