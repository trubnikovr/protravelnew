import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FlightPassengerType } from '@modules/flights';

export class FlightOrderContactRequestDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '998' })
  @Matches(/^\d{1,4}$/)
  countryCode!: string;

  @ApiProperty({ example: '90' })
  @Matches(/^\d{0,6}$/)
  areaCode!: string;

  @ApiProperty({ example: '1234567' })
  @Matches(/^\d{4,20}$/)
  phone!: string;
}

export class FlightOrderTravelerRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  travelerId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  documentId!: string;

  @ApiProperty({ enum: FlightPassengerType })
  @IsEnum(FlightPassengerType)
  passengerType!: FlightPassengerType;
}

export class CreateFlightOrderRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  offerId!: string;

  @ApiProperty({ type: FlightOrderContactRequestDto })
  @ValidateNested()
  @Type(() => FlightOrderContactRequestDto)
  contact!: FlightOrderContactRequestDto;

  @ApiProperty({ type: [FlightOrderTravelerRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(9)
  @ValidateNested({ each: true })
  @Type(() => FlightOrderTravelerRequestDto)
  travelers!: FlightOrderTravelerRequestDto[];
}
