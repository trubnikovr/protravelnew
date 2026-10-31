import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTravelFactRequestDto {
  @ApiProperty({ maxLength: 1000 })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text!: string;

  @ApiPropertyOptional({ type: String, example: 'VN', nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  countryCode?: string | null;

  @ApiPropertyOptional({ type: String, example: 'PQC', nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  destinationCode?: string | null;

  @ApiProperty({ type: [String], example: ['еда', 'культура'] })
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags!: string[];

  @ApiProperty({ default: false })
  @IsBoolean()
  isPublished!: boolean;
}

export class UpdateTravelFactRequestDto extends PartialType(
  CreateTravelFactRequestDto,
) {}
