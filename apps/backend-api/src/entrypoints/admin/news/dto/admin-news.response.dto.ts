import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';
import type { NewsCategory } from '@modules/content';

export class AdminNewsArticleResponseDto extends EntityResponseDto {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  summary!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ enum: ['promotion', 'security', 'general'] })
  category!: NewsCategory;

  @ApiProperty()
  isPublished!: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  publishedAt!: string | null;
}
