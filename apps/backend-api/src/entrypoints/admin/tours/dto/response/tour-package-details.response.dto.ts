import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourMealType } from '@modules/tours';

export class TourPackageDetailsResponseDto {
  @ApiProperty() hotelName!: string;
  @ApiPropertyOptional({ type: Number, nullable: true }) hotelCategory!:
    number | null;
  @ApiProperty({ enum: TourMealType }) mealType!: TourMealType;
  @ApiProperty() transferIncluded!: boolean;
  @ApiProperty() insuranceIncluded!: boolean;
}
