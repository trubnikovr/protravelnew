import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { TravelerDocumentType } from '@modules/customers/submodules/customer-travelers';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';

export class CreateTravelerDocumentRequestDto {
  @ApiProperty({ enum: TravelerDocumentType })
  @IsEnum(TravelerDocumentType)
  type!: TravelerDocumentType;

  @ApiProperty({ example: 'AA1234567', writeOnly: true })
  @IsString()
  @MaxLength(64)
  number!: string;

  @ApiProperty({ example: 'UZ' })
  @Matches(/^[A-Z]{2}$/)
  issuingCountryCode!: string;

  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  @IsOptional()
  @IsLocalDate()
  issuedAt?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  @IsOptional()
  @IsLocalDate()
  expiresAt?: string | null;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  firstNameLatin!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  lastNameLatin!: string;

  @ApiPropertyOptional({ nullable: true, type: String, format: 'uuid' })
  @IsOptional()
  @IsUUID()
  fileId?: string | null;
}
