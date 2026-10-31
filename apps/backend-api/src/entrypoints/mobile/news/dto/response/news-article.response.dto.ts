import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';
import type { NewsCategory } from '@modules/content';

export class NewsArticleResponseDto extends EntityResponseDto {
  @ApiProperty({ example: 'Дешёвые авиабилеты' })
  title!: string;

  @ApiProperty({ example: 'Цены на выбранное направление снизились.' })
  summary!: string;

  @ApiProperty({
    example:
      'Рассказываем, на какие даты доступны билеты и как оформить поездку.',
  })
  content!: string;

  @ApiProperty({ enum: ['promotion', 'security', 'general'] })
  category!: NewsCategory;

  @ApiProperty({ format: 'date-time' })
  publishedAt!: string;

  @ApiProperty()
  isRead!: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  readAt!: string | null;
}

export class NewsReadResponseDto {
  @ApiProperty({ format: 'uuid' })
  newsId!: string;

  @ApiProperty({ format: 'date-time' })
  readAt!: string;
}

export class NewsUnreadStatusResponseDto {
  @ApiProperty()
  hasUnread!: boolean;

  @ApiProperty({ example: 2, minimum: 0 })
  unreadCount!: number;
}
