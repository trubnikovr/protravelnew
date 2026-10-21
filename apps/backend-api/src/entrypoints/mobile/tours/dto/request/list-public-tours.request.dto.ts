import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum PublicTourSort {
  RECOMMENDED = 'recommended',
  PRICE = 'price',
}

export class ListPublicToursRequestDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ type: Number, default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional({ description: 'Country or city name' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  destination?: string;

  @ApiPropertyOptional({
    enum: PublicTourSort,
    default: PublicTourSort.RECOMMENDED,
  })
  @IsOptional()
  @IsEnum(PublicTourSort)
  sort = PublicTourSort.RECOMMENDED;
}
