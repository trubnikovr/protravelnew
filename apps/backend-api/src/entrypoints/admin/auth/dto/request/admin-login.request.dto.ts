import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AdminLoginRequestDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  @Matches(/^[a-zA-Z][a-zA-Z0-9._-]*$/)
  login!: string;

  @ApiProperty({ example: 'StrongAdminPassword1!' })
  @IsString()
  password!: string;
}
