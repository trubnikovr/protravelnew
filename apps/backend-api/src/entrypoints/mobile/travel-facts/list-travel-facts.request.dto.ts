import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListTravelFactsRequestDto {
  @ApiPropertyOptional({ example: 'PQC' })
  @IsOptional()
  @IsString()
  destinationCode?: string;

  @ApiPropertyOptional({ type: Number, default: 5, minimum: 1, maximum: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  limit = 5;
}
