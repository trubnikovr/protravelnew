import type { TravelFact } from '@modules/content';
import type {
  AdminTravelFactResponseDto,
  TravelFactResponseDto,
} from './travel-fact.response.dto';

export class TravelFactApiMapper {
  static toResponse(fact: TravelFact): TravelFactResponseDto {
    return {
      id: fact.id.toString(),
      text: fact.text,
      countryCode: fact.countryCode,
      destinationCode: fact.destinationCode,
      tags: fact.tags,
      createdAt: fact.createdAt.toISOString(),
      updatedAt: fact.updatedAt.toISOString(),
    };
  }

  static toAdminResponse(fact: TravelFact): AdminTravelFactResponseDto {
    return { ...this.toResponse(fact), isPublished: fact.isPublished };
  }
}
