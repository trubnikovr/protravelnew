import type { TravelFact } from '../domain/travel-fact';

export const TRAVEL_FACTS_REPOSITORY = Symbol('TRAVEL_FACTS_REPOSITORY');

export type TravelFactWriteData = {
  text: string;
  countryCode?: string | null;
  destinationCode?: string | null;
  tags: string[];
  isPublished: boolean;
};

export type TravelFactUpdateData = Partial<TravelFactWriteData>;

export interface TravelFactsRepository {
  listAll(): Promise<TravelFact[]>;
  create(data: TravelFactWriteData): Promise<TravelFact>;
  update(id: string, data: TravelFactUpdateData): Promise<TravelFact | null>;
  delete(id: string): Promise<boolean>;
  randomPublished(destinationCode?: string): Promise<TravelFact | null>;
  randomPublishedMany(
    destinationCode: string | undefined,
    limit: number,
  ): Promise<TravelFact[]>;
}
