import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { NewsCategory } from '@modules/content';

const NEWS_CATEGORIES = ['promotion', 'security', 'general'] as const;

export class CreateAdminNewsRequestDto {
  @ApiProperty({ example: 'Изменение расписания рейсов' })
  @IsString()
  @MinLength(1)
  @MaxLength(180)
  title!: string;

  @ApiProperty({ example: 'Проверьте актуальное время вылета перед поездкой.' })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  summary!: string;

  @ApiProperty({
    example:
      'Рассказываем, на какие даты доступны билеты и как оформить поездку.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  content!: string;

  @ApiProperty({ enum: NEWS_CATEGORIES })
  @IsIn(NEWS_CATEGORIES)
  category!: NewsCategory;

  @ApiProperty({ default: false })
  @IsBoolean()
  isPublished!: boolean;
}

export class UpdateAdminNewsRequestDto extends PartialType(
  CreateAdminNewsRequestDto,
) {}
