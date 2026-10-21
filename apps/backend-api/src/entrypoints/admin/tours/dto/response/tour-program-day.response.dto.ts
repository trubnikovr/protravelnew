import { ApiProperty } from '@nestjs/swagger';

export class TourProgramDayResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() dayNumber!: number;
  @ApiProperty() title!: string;
  @ApiProperty() description!: string;
}
