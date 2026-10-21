import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ImageRequestDto {
  @ApiProperty()
  @IsUrl({ require_tld: false })
  url!: string;
}
