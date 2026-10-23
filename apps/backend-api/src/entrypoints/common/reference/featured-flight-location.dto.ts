import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Matches, MaxLength, Min } from 'class-validator';

export class FeaturedFlightLocationResponseDto {
  @ApiProperty({ example: 'TAS' }) code!: string;
  @ApiProperty({ example: 'Ташкент' }) name!: string;
  @ApiProperty({ example: 'Узбекистан' }) countryName!: string;
  @ApiProperty() sortOrder!: number;
  @ApiProperty() isActive!: boolean;
}

export class FeaturedFlightLocationRequestDto {
  @ApiProperty({ example: 'TAS' }) @Matches(/^[A-Z]{3}$/) code!: string;
  @ApiProperty() @MaxLength(255) name!: string;
  @ApiProperty() @MaxLength(180) countryName!: string;
  @ApiProperty() @IsInt() @Min(0) sortOrder!: number;
  @ApiProperty() @IsBoolean() isActive!: boolean;
}
