import { ApiProperty } from '@nestjs/swagger';
export class FlightFareRuleSectionResponseDto {
  @ApiProperty() code!: string;
  @ApiProperty() title!: string;
  @ApiProperty() content!: string;
}
export class FlightFareRulesResponseDto {
  @ApiProperty({ type: [FlightFareRuleSectionResponseDto] })
  sections!: FlightFareRuleSectionResponseDto[];
}
