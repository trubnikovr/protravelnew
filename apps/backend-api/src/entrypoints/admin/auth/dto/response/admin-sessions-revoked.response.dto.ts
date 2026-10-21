import { ApiProperty } from '@nestjs/swagger';

export class AdminSessionsRevokedResponseDto {
  @ApiProperty({ example: true })
  revoked!: true;
}
