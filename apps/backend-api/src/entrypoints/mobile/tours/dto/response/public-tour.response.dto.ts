import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourMealType, TourType } from '@modules/tours';
import { ImageResponseDto } from '@entrypoints/common/dto/response/image.response.dto';
import { MoneyResponseDto } from '@entrypoints/common/dto/response/money.response.dto';

export class PublicTourContentResponseDto {
  @ApiProperty() title!: string;
  @ApiProperty() shortDescription!: string;
  @ApiProperty() description!: string;
  @ApiProperty({ type: String, isArray: true }) inclusions!: string[];
  @ApiProperty({ type: String, isArray: true }) exclusions!: string[];
}

export class PublicTourDestinationResponseDto {
  @ApiProperty() position!: number;
  @ApiProperty() countryCode!: string;
  @ApiProperty() countryName!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) cityName!:
    | string
    | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) nights!: number | null;
}

export class PublicTourDepartureResponseDto {
  @ApiProperty({ type: String, format: 'date' }) departureDate!: string;
  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  returnDate!: string | null;
  @ApiProperty({ type: MoneyResponseDto }) price!: MoneyResponseDto;
  @ApiPropertyOptional({ type: Number, nullable: true }) seatsTotal!:
    | number
    | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) seatsAvailable!:
    | number
    | null;
}

export class PublicTourPackageDetailsResponseDto {
  @ApiProperty() hotelName!: string;
  @ApiPropertyOptional({ type: Number, nullable: true }) hotelCategory!:
    | number
    | null;
  @ApiProperty({ enum: TourMealType }) mealType!: TourMealType;
  @ApiProperty() transferIncluded!: boolean;
  @ApiProperty() insuranceIncluded!: boolean;
}

export class PublicTourExcursionDetailsResponseDto {
  @ApiProperty() guideLanguage!: string;
  @ApiPropertyOptional({ type: Number, nullable: true }) groupSizeMax!:
    | number
    | null;
}

export class PublicTourProgramDayResponseDto {
  @ApiProperty() dayNumber!: number;
  @ApiProperty() title!: string;
  @ApiProperty() description!: string;
}

export class PublicTourListItemResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() slug!: string;
  @ApiProperty({ enum: TourType }) type!: TourType;
  @ApiProperty() durationDays!: number;
  @ApiProperty() durationNights!: number;
  @ApiProperty({ type: MoneyResponseDto }) price!: MoneyResponseDto;
  @ApiProperty({ type: [PublicTourDestinationResponseDto] })
  destinations!: PublicTourDestinationResponseDto[];
  @ApiPropertyOptional({ nullable: true, type: ImageResponseDto })
  coverImage!: ImageResponseDto | null;
  @ApiProperty() isFeatured!: boolean;
  @ApiProperty({ type: PublicTourContentResponseDto })
  content!: PublicTourContentResponseDto;
}

export class PublicTourResponseDto extends PublicTourListItemResponseDto {
  @ApiProperty({ type: [PublicTourDepartureResponseDto] })
  departures!: PublicTourDepartureResponseDto[];
  @ApiPropertyOptional({
    type: PublicTourPackageDetailsResponseDto,
    nullable: true,
  })
  packageDetails!: PublicTourPackageDetailsResponseDto | null;
  @ApiPropertyOptional({
    type: PublicTourExcursionDetailsResponseDto,
    nullable: true,
  })
  excursionDetails!: PublicTourExcursionDetailsResponseDto | null;
  @ApiProperty({ type: [PublicTourProgramDayResponseDto] })
  programDays!: PublicTourProgramDayResponseDto[];
  @ApiProperty({ type: [ImageResponseDto] }) galleryImages!: ImageResponseDto[];
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  activeFrom!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  activeTo!: string | null;
}
