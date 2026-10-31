import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TourExcursionDetailsResponseDto {
  @ApiProperty() guideLanguage!: string;
  @ApiPropertyOptional({ type: Number, nullable: true }) groupSizeMax!:
    number | null;
}
