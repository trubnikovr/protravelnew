import { ApiProperty } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class ReferenceCountryResponseDto extends EntityResponseDto {
  @ApiProperty({ example: 'UZ' })
  code!: string;

  @ApiProperty({ example: 'Россия' })
  name!: string;
}
