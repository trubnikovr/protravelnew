import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourMealType } from '@modules/tours';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class TourPackageDetailsRequestDto {
  @ApiProperty({ maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  hotelName!: string;

  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 5, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  hotelCategory?: number | null;

  @ApiProperty({ enum: TourMealType })
  @IsEnum(TourMealType)
  mealType!: TourMealType;

  @ApiProperty()
  @IsBoolean()
  transferIncluded!: boolean;

  @ApiProperty()
  @IsBoolean()
  insuranceIncluded!: boolean;
}
