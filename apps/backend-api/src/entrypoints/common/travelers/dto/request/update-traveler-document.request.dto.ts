import { PartialType } from '@nestjs/swagger';
import { CreateTravelerDocumentRequestDto } from './create-traveler-document.request.dto';

export class UpdateTravelerDocumentRequestDto extends PartialType(
  CreateTravelerDocumentRequestDto,
) {}
