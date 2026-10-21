import { ApiProperty } from '@nestjs/swagger';

export class TourContentResponseDto {
  @ApiProperty() title!: string;
  @ApiProperty() shortDescription!: string;
  @ApiProperty() description!: string;
  @ApiProperty({ type: String, isArray: true }) inclusions!: string[];
  @ApiProperty({ type: String, isArray: true }) exclusions!: string[];
}
