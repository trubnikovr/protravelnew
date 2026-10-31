import { ApiProperty } from '@nestjs/swagger';

export class FlightShareLinkResponseDto {
  @ApiProperty({ format: 'uri' }) url!: string;
  @ApiProperty({ format: 'date-time' }) expiresAt!: string;
}
