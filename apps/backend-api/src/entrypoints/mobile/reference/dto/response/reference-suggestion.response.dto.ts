import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReferenceSuggestionTypeDto } from '../request/reference-suggest.request.dto';

export class ReferenceSuggestionResponseDto {
  @ApiProperty({ enum: ReferenceSuggestionTypeDto })
  type!: ReferenceSuggestionTypeDto;
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) code!: string | null;
  @ApiProperty() name!: string;
  @ApiProperty({ format: 'uuid' }) countryId!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) countryCode!:
    string | null;
  @ApiProperty() countryName!: string;
  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  cityId!: string | null;
  @ApiProperty({ type: [String], example: ['SVO', 'DME', 'VKO'] })
  airportCodes!: string[];
}
