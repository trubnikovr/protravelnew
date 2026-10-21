import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaResponseDto {
  @ApiProperty({ minimum: 1, example: 1 })
  page!: number;

  @ApiProperty({ minimum: 1, maximum: 100, example: 20 })
  limit!: number;

  @ApiProperty({ minimum: 0, example: 125 })
  total!: number;

  @ApiProperty({ minimum: 0, example: 7 })
  totalPages!: number;
}
