import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString, MaxLength } from 'class-validator';
import { SystemMessageType } from '@modules/content';

export class CreateSystemMessageRequestDto {
  @ApiProperty({example: 'Некоторые функции временно недоступны.'})
  @IsString()
  @MaxLength(500)
  text!: string;

  @ApiProperty({enum: SystemMessageType})
  @IsEnum(SystemMessageType)
  type!: SystemMessageType;

  @ApiProperty({default: true})
  @IsBoolean()
  isActive!: boolean;
}

export class UpdateSystemMessageRequestDto extends PartialType(
  CreateSystemMessageRequestDto,
) {}
