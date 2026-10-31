import { Inject, Injectable } from '@nestjs/common';
import {
  TRAVEL_FACTS_REPOSITORY,
  type TravelFactsRepository,
  type TravelFactUpdateData,
  type TravelFactWriteData,
} from './travel-facts.repository';

@Injectable()
export class TravelFactsService {
  constructor(
    @Inject(TRAVEL_FACTS_REPOSITORY)
    private readonly repository: TravelFactsRepository,
  ) {}

  listAll() {
    return this.repository.listAll();
  }
  create(data: TravelFactWriteData) {
    return this.repository.create(data);
  }
  update(id: string, data: TravelFactUpdateData) {
    return this.repository.update(id, data);
  }
  delete(id: string) {
    return this.repository.delete(id);
  }
  randomPublished(destinationCode?: string) {
    return this.repository.randomPublished(destinationCode?.toUpperCase());
  }
  randomPublishedMany(destinationCode: string | undefined, limit: number) {
    return this.repository.randomPublishedMany(
      destinationCode?.toUpperCase(),
      limit,
    );
  }
}
