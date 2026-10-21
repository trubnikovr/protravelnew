import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourStatus, TourType } from '@modules/tours';
import { ImageResponseDto } from '@entrypoints/common/dto/response/image.response.dto';
import { MoneyResponseDto } from '@entrypoints/common/dto/response/money.response.dto';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';
import { TourContentResponseDto } from './tour-content.response.dto';
import { TourDepartureResponseDto } from './tour-departure.response.dto';
import { TourDestinationResponseDto } from './tour-destination.response.dto';
import { TourExcursionDetailsResponseDto } from './tour-excursion-details.response.dto';
import { TourPackageDetailsResponseDto } from './tour-package-details.response.dto';
import { TourProgramDayResponseDto } from './tour-program-day.response.dto';

export class TourResponseDto extends EntityResponseDto {
  @ApiProperty() slug!: string;
  @ApiProperty({ enum: TourStatus }) status!: TourStatus;
  @ApiProperty({ enum: TourType }) type!: TourType;
  @ApiProperty() durationDays!: number;
  @ApiProperty() durationNights!: number;
  @ApiProperty({ type: MoneyResponseDto }) price!: MoneyResponseDto;
  @ApiProperty({ type: [TourDestinationResponseDto] })
  destinations!: TourDestinationResponseDto[];
  @ApiProperty({ type: [TourDepartureResponseDto] })
  departures!: TourDepartureResponseDto[];
  @ApiPropertyOptional({ type: TourPackageDetailsResponseDto, nullable: true })
  packageDetails!: TourPackageDetailsResponseDto | null;
  @ApiPropertyOptional({
    type: TourExcursionDetailsResponseDto,
    nullable: true,
  })
  excursionDetails!: TourExcursionDetailsResponseDto | null;
  @ApiProperty({ type: [TourProgramDayResponseDto] })
  programDays!: TourProgramDayResponseDto[];
  @ApiPropertyOptional({ nullable: true, type: ImageResponseDto })
  coverImage!: ImageResponseDto | null;
  @ApiProperty({ type: [ImageResponseDto] }) galleryImages!: ImageResponseDto[];
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  activeFrom!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date' })
  activeTo!: string | null;
  @ApiProperty() isFeatured!: boolean;
  @ApiProperty() sortOrder!: number;
  @ApiProperty({ type: TourContentResponseDto })
  content!: TourContentResponseDto;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date-time' })
  publishedAt!: string | null;
}
