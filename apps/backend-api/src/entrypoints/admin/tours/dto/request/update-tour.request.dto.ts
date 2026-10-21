import { PartialType } from '@nestjs/swagger';
import { CreateTourRequestDto } from './create-tour.request.dto';

export class UpdateTourRequestDto extends PartialType(CreateTourRequestDto) {}
