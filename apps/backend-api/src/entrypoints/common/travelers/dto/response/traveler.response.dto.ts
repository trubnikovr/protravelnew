import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TravelerDocumentType,
  TravelerGender,
  TravelerRelationship,
} from '@modules/customers/submodules/customer-travelers';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class TravelerDocumentResponseDto extends EntityResponseDto {
  @ApiProperty({ enum: TravelerDocumentType }) type!: TravelerDocumentType;
  @ApiProperty({ example: '•••• 4567' }) maskedNumber!: string;
  @ApiProperty() issuingCountryCode!: string;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  issuedAt!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  expiresAt!: string | null;
  @ApiProperty() firstNameLatin!: string;
  @ApiProperty() lastNameLatin!: string;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'uuid' })
  fileId!: string | null;
}

export class TravelerResponseDto extends EntityResponseDto {
  @ApiProperty({ format: 'uuid' }) customerId!: string;
  @ApiProperty({ enum: TravelerRelationship })
  relationship!: TravelerRelationship;
  @ApiProperty() firstName!: string;
  @ApiProperty() lastName!: string;
  @ApiPropertyOptional({ nullable: true, type: String }) middleName!:
    string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) firstNameLatin!:
    string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) lastNameLatin!:
    string | null;
  @ApiProperty({ enum: TravelerGender }) gender!: TravelerGender;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  birthDate!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String })
  citizenshipCountryCode!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) phone!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) email!: string | null;
  @ApiProperty({ type: TravelerDocumentResponseDto, isArray: true })
  documents!: TravelerDocumentResponseDto[];
}
