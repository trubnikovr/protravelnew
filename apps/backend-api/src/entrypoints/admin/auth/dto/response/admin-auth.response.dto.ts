import { ApiProperty } from '@nestjs/swagger';
import { AdminResponseDto } from '../../../common/dto/response/admin.response.dto';

export class AdminAuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ example: 900 })
  expiresIn!: number;

  @ApiProperty({ type: AdminResponseDto })
  admin!: AdminResponseDto;
}
