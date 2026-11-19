import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';

export class BookingTravelerRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() @Matches(/\S/) @MaxLength(80) firstName!: string;
  @ApiProperty() @IsString() @IsNotEmpty() @Matches(/\S/) @MaxLength(80) lastName!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) @IsOptional() @IsString() @MaxLength(80) middleName?: string | null;
  @ApiProperty({ enum: ['male', 'female', 'unspecified'] }) @IsIn(['male', 'female', 'unspecified']) gender!: 'male' | 'female' | 'unspecified';
  @ApiPropertyOptional({ type: String, format: 'date', nullable: true }) @IsOptional() @IsLocalDate() birthDate?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) @IsOptional() @Matches(/^[A-Z]{2}$/) citizenshipCountryCode?: string | null;
}
