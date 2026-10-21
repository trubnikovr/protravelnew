import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export enum ReferenceSuggestionTypeDto {
  COUNTRY = 'country',
  CITY = 'city',
  AIRPORT = 'airport',
}

export class ReferenceSuggestRequestDto {
  @ApiProperty({ minLength: 1 })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : '',
  )
  @IsString()
  @MinLength(1)
  q!: string;

  @ApiPropertyOptional({
    enum: ReferenceSuggestionTypeDto,
    isArray: true,
    default: Object.values(ReferenceSuggestionTypeDto),
  })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : typeof value === 'string'
      ? value.split(',').filter(Boolean)
      : [],
  )
  @IsArray()
  @ArrayMaxSize(3)
  @IsEnum(ReferenceSuggestionTypeDto, { each: true })
  types: ReferenceSuggestionTypeDto[] = Object.values(
    ReferenceSuggestionTypeDto,
  );

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  countryId?: string;

  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 50, default: 20 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 20;
}
