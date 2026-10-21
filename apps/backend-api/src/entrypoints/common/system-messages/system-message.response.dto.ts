import { ApiProperty } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';
import { SystemMessageType } from '@modules/content';

export class SystemMessageResponseDto extends EntityResponseDto {
  @ApiProperty({example: 'Некоторые функции временно недоступны.'})
  text!: string;

  @ApiProperty({enum: SystemMessageType})
  type!: SystemMessageType;

  @ApiProperty()
  isActive!: boolean;
}
