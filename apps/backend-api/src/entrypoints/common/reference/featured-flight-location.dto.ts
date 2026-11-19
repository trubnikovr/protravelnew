import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsUUID, Min } from 'class-validator';

export class FeaturedFlightLocationResponseDto {
  @ApiProperty({ format: 'uuid' }) cityId!: string;
  @ApiProperty({ example: 'Ташкент' }) name!: string;
  @ApiProperty({ example: 'Узбекистан' }) countryName!: string;
  @ApiProperty({ type: [String], example: ['TAS', 'UGC'] }) airportCodes!: string[];
  @ApiProperty() sortOrder!: number;
  @ApiProperty() isActive!: boolean;
}

export class FeaturedFlightLocationRequestDto {
  @ApiProperty({ format: 'uuid' }) @IsUUID() cityId!: string;
  @ApiProperty() @IsInt() @Min(0) sortOrder!: number;
  @ApiProperty() @IsBoolean() isActive!: boolean;
}
