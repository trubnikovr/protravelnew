import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseMetaDto {
  @ApiProperty({ format: 'date-time' })
  timestamp!: string;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  requestId!: string;

  @ApiPropertyOptional()
  traceId?: string;
}

export class ApiErrorBodyDto {
  @ApiProperty({ example: 'USER_NOT_FOUND' })
  code!: string;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional({ nullable: true })
  details!: unknown;
}

export class ApiErrorEnvelopeDto {
  @ApiProperty({ type: ApiErrorBodyDto })
  error!: ApiErrorBodyDto;

  @ApiProperty({ type: ApiResponseMetaDto })
  meta!: ApiResponseMetaDto;
}
