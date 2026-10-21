import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerLoginChallengeResponseDto {
  @ApiProperty({ format: 'uuid' }) verificationId!: string;
  @ApiProperty({ example: 300 }) expiresIn!: number;
  @ApiPropertyOptional({
    description: 'Present only when the mock SMS adapter is enabled',
    example: '4322',
  })
  developmentCode?: string;
}

export class CustomerAuthSessionResponseDto {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
  @ApiProperty({ example: 'Bearer' }) tokenType!: 'Bearer';
  @ApiProperty({ example: 900 }) expiresIn!: number;
}
