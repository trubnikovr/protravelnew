import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MoneyResponseDto } from '@entrypoints/common/dto/response/money.response.dto';

export class HomeTourResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() title!: string;
  @ApiProperty() location!: string;
  @ApiProperty() duration!: string;
  @ApiProperty({ type: MoneyResponseDto }) price!: MoneyResponseDto;
  @ApiPropertyOptional({ nullable: true }) imageUrl!: string | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) hotelCategory!:
    number | null;
}

export class HomeDestinationResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() title!: string;
  @ApiProperty() subtitle!: string;
  @ApiProperty({ type: MoneyResponseDto }) fromPrice!: MoneyResponseDto;
  @ApiPropertyOptional({ nullable: true }) imageUrl!: string | null;
}

export class HomeResponseDto {
  @ApiProperty({ type: [HomeTourResponseDto] })
  recommended!: HomeTourResponseDto[];

  @ApiProperty({ type: [HomeDestinationResponseDto] })
  popularDestinations!: HomeDestinationResponseDto[];

  @ApiProperty({ type: [HomeTourResponseDto] })
  hotTours!: HomeTourResponseDto[];
}
