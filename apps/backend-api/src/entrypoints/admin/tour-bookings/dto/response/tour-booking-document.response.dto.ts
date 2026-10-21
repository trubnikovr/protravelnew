import { ApiProperty } from '@nestjs/swagger';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class TourBookingDocumentResponseDto extends EntityResponseDto {
  @ApiProperty() originalName!: string;
  @ApiProperty() mimeType!: string;
  @ApiProperty({ type: Number }) size!: number;
  @ApiProperty({ format: 'uuid' }) uploadedByAdminId!: string;
  @ApiProperty() downloadUrl!: string;
}
