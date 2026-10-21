import { PartialType } from '@nestjs/swagger';
import { CreateTravelerRequestDto } from './create-traveler.request.dto';

export class UpdateTravelerRequestDto extends PartialType(
  CreateTravelerRequestDto,
) {}
