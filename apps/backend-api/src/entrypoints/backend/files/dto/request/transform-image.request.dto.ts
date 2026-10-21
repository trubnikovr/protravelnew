import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { ImagePreset } from '@core/submodules/files';

export class TransformImageRequestDto {
  @ApiProperty({
    example:
      'http://localhost:3000/api/v1/files/images/550e8400-e29b-41d4-a716-446655440000.jpg',
  })
  @IsString()
  @MaxLength(2048)
  src!: string;

  @ApiProperty({ enum: ImagePreset, example: ImagePreset.HOME_CARD })
  @IsEnum(ImagePreset)
  preset!: ImagePreset;
}
