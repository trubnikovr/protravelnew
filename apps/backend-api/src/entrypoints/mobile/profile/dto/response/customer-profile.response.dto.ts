import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';
import { CurrencyCode, SupportedLocale } from '@shared/domain/enums';
import { CustomerStatus } from '@modules/customers';

export class CustomerProfileResponseDto extends EntityResponseDto {
  @ApiPropertyOptional({nullable: true, type: String})
  phone!: string | null;

  @ApiPropertyOptional({nullable: true, type: String})
  email!: string | null;

  @ApiProperty()
  firstName!: string;

  @ApiPropertyOptional({nullable: true, type: String})
  lastName!: string | null;

  @ApiPropertyOptional({nullable: true, type: String})
  middleName!: string | null;

  @ApiProperty({enum: SupportedLocale})
  locale!: SupportedLocale;

  @ApiProperty({enum: CurrencyCode})
  currency!: CurrencyCode;

  @ApiProperty({example: 'Asia/Tashkent'})
  timeZone!: string;

  @ApiProperty({enum: CustomerStatus})
  status!: CustomerStatus;
}
