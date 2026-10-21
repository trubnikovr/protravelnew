import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class TourExcursionDetailsRequestDto {
  @ApiProperty({ example: 'Русский', maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  guideLanguage!: string;

  @ApiPropertyOptional({ type: Number, minimum: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  groupSizeMax?: number | null;
}
