import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class TravelFactResponseDto extends EntityResponseDto {
  @ApiProperty({ example: 'В Японии чаевые обычно не приняты.' })
  text!: string;

  @ApiPropertyOptional({ type: String, example: 'JP', nullable: true })
  countryCode!: string | null;

  @ApiPropertyOptional({ type: String, example: 'NRT', nullable: true })
  destinationCode!: string | null;

  @ApiProperty({ type: [String], example: ['культура', 'этикет'] })
  tags!: string[];
}

export class AdminTravelFactResponseDto extends TravelFactResponseDto {
  @ApiProperty()
  isPublished!: boolean;
}
