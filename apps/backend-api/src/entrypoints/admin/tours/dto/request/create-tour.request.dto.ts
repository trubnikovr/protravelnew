import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { TourStatus, TourType } from '@modules/tours';
import { ImageRequestDto } from '@entrypoints/common/dto/request/image.request.dto';
import { MoneyRequestDto } from '@entrypoints/common/dto/request/money.request.dto';
import { IsLocalDate } from '@entrypoints/common/validation/is-local-date.decorator';
import { TourContentRequestDto } from './tour-content.request.dto';
import { TourDepartureRequestDto } from './tour-departure.request.dto';
import { TourDestinationRequestDto } from './tour-destination.request.dto';
import { TourExcursionDetailsRequestDto } from './tour-excursion-details.request.dto';
import { TourPackageDetailsRequestDto } from './tour-package-details.request.dto';
import { TourProgramDayRequestDto } from './tour-program-day.request.dto';

export class CreateTourRequestDto {
  @ApiProperty({ example: 'turkey-family-week' })
  @IsString()
  @MaxLength(160)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @ApiProperty({ enum: TourStatus })
  @IsEnum(TourStatus)
  status!: TourStatus;

  @ApiProperty({ enum: TourType })
  @IsEnum(TourType)
  type!: TourType;

  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  minTravelers?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxTravelers?: number | null;

  @ApiProperty({ minimum: 1, maximum: 365 })
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays!: number;

  @ApiProperty({ minimum: 0, maximum: 364 })
  @IsInt()
  @Min(0)
  @Max(364)
  durationNights!: number;

  @ApiProperty({ type: MoneyRequestDto, description: 'Displayed price from' })
  @ValidateNested()
  @Type(() => MoneyRequestDto)
  price!: MoneyRequestDto;

  @ApiProperty({ type: [TourDestinationRequestDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => TourDestinationRequestDto)
  destinations!: TourDestinationRequestDto[];

  @ApiProperty({ type: [TourDepartureRequestDto], default: [] })
  @IsArray()
  @ArrayMaxSize(365)
  @ValidateNested({ each: true })
  @Type(() => TourDepartureRequestDto)
  departures!: TourDepartureRequestDto[];

  @ApiPropertyOptional({ type: TourPackageDetailsRequestDto, nullable: true })
  @ValidateIf((value: CreateTourRequestDto) => value.type === TourType.PACKAGE)
  @IsDefined()
  @ValidateNested()
  @Type(() => TourPackageDetailsRequestDto)
  packageDetails?: TourPackageDetailsRequestDto | null;

  @ApiPropertyOptional({ type: TourExcursionDetailsRequestDto, nullable: true })
  @ValidateIf(
    (value: CreateTourRequestDto) => value.type === TourType.EXCURSION,
  )
  @IsDefined()
  @ValidateNested()
  @Type(() => TourExcursionDetailsRequestDto)
  excursionDetails?: TourExcursionDetailsRequestDto | null;

  @ApiProperty({ type: [TourProgramDayRequestDto], default: [] })
  @ValidateIf(
    (value: CreateTourRequestDto) => value.type === TourType.EXCURSION,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(365)
  @ValidateNested({ each: true })
  @Type(() => TourProgramDayRequestDto)
  programDays!: TourProgramDayRequestDto[];

  @ApiPropertyOptional({ nullable: true, type: ImageRequestDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ImageRequestDto)
  coverImage?: ImageRequestDto | null;

  @ApiProperty({ type: [ImageRequestDto], maxItems: 12, default: [] })
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => ImageRequestDto)
  galleryImages!: ImageRequestDto[];

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @IsOptional()
  @IsLocalDate()
  activeFrom?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @IsOptional()
  @IsLocalDate()
  activeTo?: string | null;

  @ApiProperty({ default: false })
  @IsBoolean()
  isFeatured!: boolean;

  @ApiProperty({ default: 0 })
  @IsInt()
  sortOrder!: number;

  @ApiProperty({ type: TourContentRequestDto })
  @ValidateNested()
  @Type(() => TourContentRequestDto)
  content!: TourContentRequestDto;
}
