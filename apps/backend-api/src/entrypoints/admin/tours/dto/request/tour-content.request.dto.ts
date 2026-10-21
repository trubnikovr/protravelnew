import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class TourContentRequestDto {
  @ApiProperty({ maxLength: 180 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title!: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  shortDescription!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  inclusions!: string[];

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  exclusions!: string[];
}
