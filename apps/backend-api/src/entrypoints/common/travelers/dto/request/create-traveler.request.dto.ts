import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  TravelerGender,
  TravelerRelationship,
} from '@modules/customers/submodules/customer-travelers';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';

export class CreateTravelerRequestDto {
  @ApiProperty({ enum: TravelerRelationship })
  @IsEnum(TravelerRelationship)
  relationship!: TravelerRelationship;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  lastName!: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  middleName?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstNameLatin?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastNameLatin?: string | null;

  @ApiProperty({ enum: TravelerGender })
  @IsEnum(TravelerGender)
  gender!: TravelerGender;

  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  @IsOptional()
  @IsLocalDate()
  birthDate?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String, example: 'UZ' })
  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  citizenshipCountryCode?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsEmail()
  email?: string | null;
}
