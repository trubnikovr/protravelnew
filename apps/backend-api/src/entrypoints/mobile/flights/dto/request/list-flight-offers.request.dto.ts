import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseListRequestDto } from '@entrypoints/common/dto/request/base-list.request.dto';

export enum FlightOfferSortField {
  CREATED_AT = 'createdAt',
  PRICE = 'price',
  DURATION = 'duration',
  DEPARTURE = 'departure',
}

export class ListFlightOffersRequestDto extends BaseListRequestDto {
  @ApiPropertyOptional({
    enum: FlightOfferSortField,
    default: FlightOfferSortField.PRICE,
  })
  @IsEnum(FlightOfferSortField)
  override sortBy: FlightOfferSortField = FlightOfferSortField.PRICE;
}
